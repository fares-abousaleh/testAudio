 
 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/
/*-----------------------------------------
	Reads a string <s> of the format:
	T c1 v1 c2 v2 ... cn vn
	where:
	T is a float representing number of equal divisions of an octave
	c1,c2,...,cn are characters representing keys to be used
	v1,v2,...,vn are floats representing the number of divisions from the start of octave
  ----------------------------------------*/	
function defScale(s){
	let keys = {}
	const ss = s.trim().replaceAll("\n"," ").split(/ +/) 
	const step = 1.0 / parseFloat(ss[0])
	for(let k=1;k<ss.length;k+=2){
		keys[ss[k]] = Math.pow(2,parseFloat(ss[k+1])*step)
	}
	return keys
}
/*-----------------------------------------
	Defines a scale using just intonation:
	Reads a string <s> of the format:
	T c1 v1 c2 v2 ... cn vn
	where:
	<T> is a float representing the denominator
	c1,c2,...,cn are characters representing keys to be used
	v1,v2,...,vn are floats representing the numerators
  ----------------------------------------*/	

function defScaleR(s){
	let keys = {}
	const ss = s.trim().replaceAll("\n"," ").split(/ +/) 
	const step = 1.0 / parseFloat(ss[0])
	for(let k=1;k<ss.length;k+=2){
		keys[ss[k]] = parseFloat(ss[k+1])*step
	}
	return keys
}

/*-----------------------------------------
	Reads a string <s> of notes.
	Compile sound to buffer <dest>
	Using the scale <keys>
    <dt> is the time unit in seconds.
    <ins> is the instrument object to be used.	
  ----------------------------------------*/	

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
				mixSnd( dest,ins.make(fr,tm),pos,vl  )
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
	
const stdkeysR  = defScale("24 c 24 C 25 d 26 D 28 u 29 e 31 f 34 F 36 g 38 G 40 v 42 a 43 A 45 w 46 b 47")
	
  

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
		let f1 = 900
		 
		let frm1 = Math.ceil(f1/fr)*fr
		res.designRes( frm1,   0.05* frm1)
		const hi  = new Filter()
		let f2 = 3900
		 
		let frm2 = Math.ceil(f2/fr)*fr
		hi.designRes( frm2,   0.05* frm2)
		for(let k=0;k<n;k++,t+=1){
			
			let A = Math.sin(k*Math.PI/n)
			let v = rnd(0.9,1)*(t%(perd*((1+0.0004*Math.sin(t*30.0/rate)))))-perd/4
			v = dck.tic( v )
			 
			snd[k] = A*( res.tic( v ) + 0.3*A * hi.tic( v) )
		}
		normalise(snd)
		return snd
   }	   

}

class InsStr {
	
	constructor(a=400.0,b=900.0,lopg=0.23,g=0.999,L=0.85){
		 
		this.frm1 = a
		this.frm2 = b
		this.lopg = lopg
		this.g    = g
		this.N = Math.round(L*rate)
		this.imp = new Float32Array(this.N)
		this.im = new Float32Array(this.N)
		this.makeImpulse("123 2.3 100 1.9 200 1.9 321 0.8 411 0.7 545 .93 711.01 0.1 900 0.95  1102 0.3 1212 0.71 2341 0.53 3411 0.52")
		//saveWave("imp",this.imp,rate)
	}
	
	addImpulse(fr,dec){
		console.log("fr:",fr,"dec:",dec)
		const res = new Filter()
		res.designRes(fr,0.02*fr)
		let a = 1
		if(rndDecide(0.5))a=-1
		let g = Math.pow(0.01 ,1.0/(rate*dec))
		 
		for(let k=0;k<this.N;k++,a*=g){
			this.im[k]=res.tic(rnd())*a 
			 
		}
		normalise(this.im,Math.exp(-fr*0.00071))
		mixSnd(this.imp,this.im,0)
	}
	
	makeImpulse(s){
		this.imp.fill(0)
		let ss = s.trim().split(/ +/)
		for(let i=0;i<ss.length;i+=2)
			this.addImpulse(parseFloat(ss[i]),parseFloat(ss[i+1]))
		let b=0
		for(let k=0;k<100.0;k++ ){
			this.imp[k]*= b
			 b+=0.01
		}
		normalise(this.imp)
		delete this.im
	}
	
	make(fr,len){
		// len is ignored !
		let snd = new Float32Array(this.N)
		
		let perd =  rate *1.0/ fr
		let lop =0.9973
		var a = 1
		var ext = 1
		const g = Math.pow(0.01,500.0/(fr*this.N))
		var mx = 0;
		
		let lowp = new Filter()
		lowp.designLowPass(this.lopg)
		// let res = new Filter()
		// res.designRes(fr,12*fr)
		let A = 1
		
		for(let k=0;k<snd.length;k++,a*=g){
			 let ext =   getV(this.imp,k )   
			 let b = getV(snd,k-perd) 
			 let v  = ext +this.g*lowp.tic(b) 
			 snd[k]=v
			 v = Math.abs(v)
			 if(v>mx)mx=v
		}
		
		if(mx>0){
			mx=1.0/mx
			let a = 1
			const da = 1.0/snd.length
			  
			for(let k=0;k<snd.length;k++){
				snd[k]*= mx*a;
				a-=da
			}
		}
		
		
		
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