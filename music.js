 
 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/

const BaseFr = 261.3
var   Transp = 1.0

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

function makeMusic(dest,s,dt=1,ins){
	let oct = 4
	let oc  = 4
	let tm  = 0
	let dtn  = dt
	let nt  = ','
	let pos = 0
	let vol = 0.5
	let vl  = 0.5
	let tr = 1.0
	Transp = 1.0
	s+="S"
	let k=-1 
	while(k<s.length-1){
		k++
		if(s[k]==' ')continue
		else
		if(s[k]=='+')oct++
		else 
		if(s[k]=='-')oct--
		else
		if(s[k]=='.')  tm+=dtn 
		else
		if(s[k]=='/'){
			k++
			tr = stdkeys[s[k]]
			if(tr==undefined)return false	
		}else
		if('0123456789'.search(s[k])>=0)
			vol=parseFloat(s[k])/10.0
		else if(s[k]==':'){
			k++
			if('0123456789'.search(s[k])>=0)
			dtn = dt/parseInt(s[k])
			else return false 
		}
		else{
			if(tm!=0){
				if(nt!=',')
					mixSnd( dest,ins.get(nt,oc,tm),pos,vl  )
				pos+=tm
			}
			if(stdkeys[s[k]])
				nt = s[k]
			else nt=','
			tm = dtn		
			vl = vol 
			oc = oct
			Transp = tr
		}
	}
	return true
}


const stdkeys = defScale("6 c 0 C 0.5 d 1 D 1.5 u 1.75 e 2 f 2.5 F 3 g 3.5 G 4 v 4.25 a 4.5 A 5 w 5.25 b 5.5")
	
const stdkeysR  = defScale("24 c 24 C 25 d 26 D 28 u 29 e 31 f 34 F 36 g 38 G 40 v 42 a 43 A 45 w 46 b 47")
	
  

class InsDrm{

    constructor(){
	   this.hist = {}
	   this.N = Math.round(0.1*rate)
	   this.frs = {
		              'c':[623 ,900 ,1300],
					  'd':[3000,4122,2402],
					  'e':[1000,2122,3402],
					  'f':[723 ,832 ,1000],
					  'g':[903 ,422, 522 ],
					  'a':[1710,2422,4402],
				      'C':[2623 ,1900 ,3300],
					  'D':[4210,5122,4402],
					  'F':[3000,5122,6402],
					  'G':[2723 ,1832 ,7000],
					  'A':[9103 ,8422, 4522 ],
					  'b':[9710,11422,2402],
					  'u':[9710,422,202],
					  'v':[7710,2422,102],
					  'w':[8710,1122,402],
					  
				  }
	}
	
	make(nt,oct,L){
		let frs = this.frs[nt]
		if(frs==undefined)return []
		let snd = new Float32Array(this.N)
		let th = [0,0,0]
		const dth0 = Math.PI*2.0/rate
		let dth = [ frs[0]*dth0, frs[1]*dth0, frs[2]*dth0 ]
		 
		for(let k=0;k<this.N;k++){	 
			th[0] += dth[0]*rnd(0.9,1.1)
			th[1] += dth[1]*rnd(0.9,1.1)
			th[2] += dth[2]*rnd(0.9,1.1)
			snd[k] = Math.sin(th[0])/(1+0.009*k)
			       - Math.sin(th[1])/(1+0.03 *k)
				   + Math.sin(th[2])/(1+0.09*k)
		}
		normalise(snd)
		//console.log("drm made so far:",this.hist)
		return snd;
	}
	
	get(nt,oct,L){
		if(!this.hist[nt+oct])
			this.hist[nt+oct]=this.make(nt,oct,L)
		return this.hist[nt+oct]
	}
	
}


function freq(nt,oct){
	return Transp * BaseFr * Math.pow(2,oct-4) * stdkeys[nt]
}

class InsSqr {
   
   constructor(frm1=13,frm2=15){
		this.frm1 = frm1
		this.frm2 = frm2
   }	   
   waveform(t,perd){ 
	   return t% perd - perd/2
   }		
   get(nt,oct,L){    
	   let fr = freq(nt,oct)
	    const n = Math.ceil( L*rate)
		const snd = new Float32Array(n)
		const perd = rate/fr
		let t = 0
		const dck = new Filter()
		dck.designDCKill( 0.95 )
		
		const res  = new Filter() 
		let frm1 = this.frm1
		 while(frm1< 2*fr)frm1*=1.12
		res.designRes( frm1, 0.1 * frm1 ) 
		
		const hi  = new Filter()
		let frm2 = this.frm2
		 while(frm2< 4*fr)frm2*=1.12
		hi.designRes( frm2, 0.15* frm2  )
		console.log("frm1=",frm1,"   frm2=",frm2)
		 
		let rr =1
		
		for(let k=0;k<n;k++,t+=1){
			
			let A = Math.sin(k*Math.PI/n)
			 
			let v =  this.waveform(t,perd*(1+0.0004*Math.sin(t*30.0/rate))) 
			v = dck.tic( v )
			 
			snd[k] = A*( res.tic( v ) +   hi.tic( v) )
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
	}
	
	
	get(nt,oct,len){
		// len is ignored !
		let snd = new Float32Array(this.N)
		let fr = freq(nt,oct) 
		let perd =  rate *1.0/ fr
		 
		var a = 1
		var ext = 0
		const g =  Math.pow(this.g,perd/30.0)
		var mx = 0;
		const dck = new Filter()
		dck.designDCKill(0.95)
		 let lowp = new Filter()
		 lowp.designLowPass( this.lopg  )
		  
		 const res1 = new Filter()
		 const res2 = new Filter()
		 res1.designRes(this.frm1,0.1*this.frm1)
		 res2.designRes(this.frm2,0.1*this.frm2)
		 
		const lo = Math.exp(-fr/100.0)
		 const r = rnd(0,this.imp.length/3)
		for(let k=0;k<snd.length;k++){
			 
			   ext = rnd()
  			   ext = 0.9 *res1.tic(ext)/(0.003*k+1)
			       - 0.9 *res2.tic(ext)/(0.01*k+1) 
			   ext =    dck.tic( ext ) 
			   
			 let b =  getV(snd,k-perd) 
			  b=lowp.tic(b)
			  
			 let v  = ext +g*b 
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
		
		
		//console.log("str made so far:",this.hist)
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