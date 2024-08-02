 
 
	
function getV(arr,t){
	if(t<0||t>=arr.length-1)return 0
	
	const a = Math.floor(t)
	const b = a+1
	
	return (b-t)*arr[a]+(t-a)*arr[b]
}

 


function StrIns(){
	this.make=function(fr,len){
	const n = Math.ceil( len * rate )
	let snd = new Float32Array(n)
	
	let perd =  rate *1.0/ fr
	let lop =0.9973
	var a = 1
	var ext = 1
	const g = Math.pow(0.01,1.0/n)
	var mx = 0;
	let res = new Filter()
	res.designRes(900,23  )
	let lowp = new Filter()
	lowp.designLowPass(0.23)
	let A = 1
	
	for(let k=0;k<snd.length;k++,a*=g){
		 if(A>0)A-=0.11/fr
		 ext=res.tic(rnd()*A)
		 
		 let b = getV(snd,k-perd ) 
		   
		let u  =  ext+((1-A)*b+A*lowp.tic(b)) 
		 
		 
		 
		 
		snd[k]=u
		let v = Math.abs(u)
		if(v>mx)mx=v
	}
	if(mx>0){
		mx=1.0/mx
		let a = 1
		let atk =0
		const da = 2.0/snd.length
		for(let k=0;k<snd.length;k++){
			if(atk<1)atk+=0.02
			a=(snd.length-k)*1.0/snd.length
			snd[k]*=atk*mx*a;
		}
	}
	
	
	
	return snd
	}
	
	this.hist={}
	
	this.get=function(fr,L){
		if(!this.hist[fr])this.hist[fr]={}
		if(!this.hist[fr][L])
			this.hist[fr][L]=this.make(fr,L)
		return this.hist[fr][L]
	}
}

function mixSnd(dest,src,pos,vol=1){
	  pos = Math.round(rate * pos)
	const n = Math.min( pos+src.length,dest.length)
	
	for(let k=pos;k<n;k++)
		dest[k]+=vol*src[k-pos]
}


function defScale(s){
	let keys = {}
	const ss = s.trim().replaceAll("\n"," ").split(/ +/) 
	const step = 1.0 / parseFloat(ss[0])
	for(let k=1;k<ss.length;k+=2){
		keys[ss[k]] = Math.pow(2,parseFloat(ss[k+1])*step)
	}
	return keys
}

function defScaleR(s){
	let keys = {}
	const ss = s.trim().replaceAll("\n"," ").split(/ +/) 
	const step = 1.0 / parseFloat(ss[0])
	for(let k=1;k<ss.length;k+=2){
		keys[ss[k]] = parseFloat(ss[k+1])*step
	}
	return keys
}

function makeMusic(dest,keys,s,dt=1,ins){
	let oct = 0
	let tm  = dt
	let fr  = -1
	let pos = 0
	let vol = 0.5
	let vl  = 0.5
	const BaseFr = 261.3
	s+="S"
	console.log(s)
	for(let k=0;k<s.length;k++)
		if(s[k]==' ')continue
		else
		if(s[k]=='+')oct++
		else 
		if(s[k]=='-')oct--
		else
		if(s[k]=='.')  tm+=dt 
		else
		if('0123456789'.search(s[k])>=0)
			vol=parseFloat(s[k])/10.0
		else{
			if(fr>0){
				mixSnd( dest,ins.get(fr,tm),pos,vl  )
				pos+=tm
			}else if(fr==0)pos+=tm
			if(keys[s[k]])
				fr = keys[s[k]] * BaseFr * Math.pow( 2, oct )
			else fr=0
			tm = dt		
			vl = vol 
		}
}

 

const stdkeys = defScale("6 c 0 C 0.5 d 1 D 1.5 u 1.75 e 2 f 2.5 F 3 g 3.5 G 4 v 4.25 a 4.5 A 5 w 5.25 b 5.5")
	
//const stdkeysR = defScale("21 c 21 C 22 d 23 D 24 u 25 e 26 f 27 F 28 g 29 G 30 v 31 a 32 A 33 w 34 b 35")
	
  

class InsWind{

    constructor(){
	   this.hist = {}
	}
	
	f(t){
		return t*(1.3-t*t)*(1+t*(1+t))
	}
	
	make(fr,L){
		let dck = new Filter()
		dck.designDCKill(0.9)
		let n = Math.ceil( L*rate)
		let snd = new Float32Array(n)
		let th = 0
		let dth = fr*Math.PI*2.0/rate
		let a = 0
		let t =0
		let dt = Math.PI/n
		const r = rnd(Math.PI)
		const A = sat(500.0/fr,0,1)
		for(let k=0;k<n;k++){
			 
			a = Math.tanh( 5*Math.sin(t) )*A 
			snd[k]=a*dck.tic(this.f(Math.sin(th)*a*(1.0 + 0.00026*Math.sin(3*t))))
			 
			th += dth * (1.0 + 0.006*Math.sin(10*t))
			t+=dt
		}
		normalise(snd)
		return snd;
	}
	
	get(fr,L){
		if(!this.hist[fr])this.hist[fr]={}
		if(!this.hist[fr][L])
			this.hist[fr][L]=this.make(fr,L)
		return this.hist[fr][L]
	}
	
}

class InsSqr extends InsWind{
   
   constructor(nfr=13,hi=15){
	    super()
		this.nfr = nfr
		this.hi = hi
   }	   
   	
   make(fr,L){
	    const n = Math.ceil( L*rate)
		const snd = new Float32Array(n)
		const perd = rate/fr
		let t = 0
		const dck = new Filter()
		dck.designDCKill( 0.95 )
		const res  = new Filter()
		res.designRes( this.nfr*fr,   0.5*fr)
		const hi  = new Filter()
		hi.designRes( this.hi*fr,   0.5*fr)
		for(let k=0;k<n;k++,t+=1){
			let v = (t%(perd*((1+0.0004*Math.sin(t*30.0/rate)))))-perd/4
			let A = Math.sin(k*Math.PI/n)
			v = dck.tic( v )
			snd[k] = A*( res.tic( v ) + hi.tic( v) )
		}
		normalise(snd)
		return snd
   }	   

}

function normalise(v,vol=1.0){
	let mx = 0
	for(let k=0;k<v.length;k++)
		mx = Math.max(mx,Math.abs(v[k]))
	if(mx==0)return
	
	mx=vol/mx
	for(let k=0;k<v.length;k++)
		v[k]*=mx
}