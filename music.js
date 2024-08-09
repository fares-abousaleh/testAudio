 
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

function makeMusic(dest,s,dt=1,ins,strt=0){
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
			if(k>=strt)tm = dtn		
			else tm=0
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
	    
	   this.N = Math.round(0.4*rate)
	   this.frs = {
		              'c':[623 ,900 ,1300],
					  'd':[700 ,1122,2402],
					  'e':[1000,2122,3402],
					  'f':[723 ,1832 ,1200],
					  'g':[903 ,1262, 1522 ],
					  'a':[1710,2422,4402],
				      'C':[1123 , 1500 ,3300],
					  'D':[3610,5122,9402],
					  'F':[2090,4122,5402],
					  'G':[ 723 , 832 ,1700 ],
					  'A':[3910  ,4422, 8522 ],
					  'b':[1710,1422,2402],
					  'u':[910,1422,11202],
					  'v':[ 710,2422,3510 ],
					  'w':[910,1122,4402],
					  
				  }
	}
	
	get(nt,oct,L){
		let frs = this.frs[nt]
		if(frs==undefined)return []
		let snd = new Float32Array(this.N)
		let th = [0,0,0]
		const dth0 = Math.PI*2.0/rate
		let dth = [ frs[0]*dth0, frs[1]*dth0, frs[2]*dth0 ]
		 
		const a0=  100.0/frs[0] 
		const a1=  100.0/frs[1]
		const a2=  100.0/frs[2]
		
		 
		for(let k=0;k<this.N;k++){	 
		     
			 
			th[0] += dth[0]*rnd(1-0.00002*frs[0],1+0.00002*frs[0])*sat(1-k*12.0/frs[0],0.6,1)
			th[1] += dth[1]*rnd(1-0.00019*frs[1],1+0.00019*frs[1])*sat(1-k*12.0/frs[1],0.6,1)
			th[2] += dth[2]*rnd(1-0.001*frs[2],1+0.001*frs[2])*sat(1-k*12.0/frs[2],0.6,1)
			snd[k] =   
            			a0*Math.sin(th[0])/(1+0.0009*k)
			          + a1*Math.sin(th[1])/(1+0.002 *k)
				      + a2*Math.sin(th[2])/(1+0.006*k)
				    
		}
		normalise(snd,0.25 )
		//console.log("drm made so far:",this.hist)
		return snd;
	}
	
	
	
}


function freq(nt,oct){
	return Transp * BaseFr * Math.pow(2,oct-4) * stdkeys[nt]
}

class InsSqr {
    
   constructor(frm1=925,frm2=2119){
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
		  let frm1 = Math.ceil(this.frm1/(fr))*fr
		//let frm1 = this.frm1 
		//res.designRes( frm1, 0.1 * frm1 ) 
		
		const hi  = new Filter()
		  let frm2 = Math.ceil(this.frm2/(fr))*fr
		//let frm2 = this.frm2  
		
		//hi.designRes( frm2, 0.1 * frm2  )
		console.log("frm1=",frm1,"   frm2=",frm2)
		 
		let rr =0
		let r  =0
		let filt = new Filter()
		 
		for(let k=0;k<n;k++,t+=1){
			
			let A = Math.sin(k*Math.PI/n)
			 
			let v =   this.waveform(t,perd*(1+0.00004*Math.sin(t*30.0/rate))) 
			v = dck.tic( v )
			
			r  = 0.07*Math.sin(k*2*10.0*Math.PI/rate)
			rr = 0.09*Math.sin(k*2*13.1*Math.PI/rate)
			 
			res.designRes( frm1, 0.1* frm1 *(1+r) )			
			hi.designRes( frm2 , 0.1* frm2*(1+rr)  )			
			 
			snd[k] = A *  (    res.tic( v ) +   hi.tic( v )) 
		}
		normalise(snd)
		return snd
   }	   

}

class InsStr {
	
	constructor(a=400.0,b=900.0,lopg=0.23,g=0.999,L=1.0){ 
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
  			   ext =   0.9 *res1.tic(ext)/(0.003*k+1)
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


class InsWind{
	
	constructor(cf){
		this.cf = cf
	}
	
	f(x){
		
		return Math.tanh(this.cf[0]*x)
	}
	
	get(nt,oct,tm){
		const fr = freq(nt,oct)
		const perd =  rate*1.0/fr
		const dth = fr*2*Math.PI/rate
		let   th = 0 
		const n = Math.ceil(tm*rate)
		const snd = new Float32Array(n)
		let   t = 0 
		const dt = 2*Math.PI/rate
		const fl = new Filter()
		const cf  = 300.0/fr
		fl.designDCKill(0.95)
		for(let k=0;k<n;k++){
			let A = Math.tanh((4+Math.sin(6*t))*Math.sin(k*Math.PI/n))
			t+=dt
			let v = A * Math.sin(th)
			 th+=dth*(1+  (1.953-k*0.6/n)* getV(snd,k - perd*1.3+perd*k*1.0/n ))
			//th+=dth*Math.sin(t *151)
			snd[k] =   fl.tic(this.f(cf* v))
		}
		
		normalise(snd,cf)
		return snd
	}
}


class InsVio{
	
	constructor(frms){
		this.frms = frms
	}
	
	get(nt,oct,L){
		const fr = freq(nt,oct)
		const dt = 2*Math.PI/rate
		const perd =  rate*1.0/fr
		const dth = fr*dt
		let   th = 0 
		const n = Math.ceil(L*rate)
		const snd = new Float32Array(n)
		let   t = 0 
		
		const fl = new Filter() 
		fl.designDCKill(0.95)
		
		const lo = new Filter()
		lo.designLowPass(0.9)
		
		const frm = Math.ceil(this.frms[0]/fr)
		let i = 0.0
		let v = 0
		let acc = 0
		
		for(let k=0;k<n;k++){
			let A = Math.tanh((3+Math.sin(6*t)+Math.sin(7*t))*Math.sin(k*Math.PI/n))
			v =   Math.sin(th)
			let aa = Math.sqrt(acc/ (k+1)) 
			th += dth * ( 1 + 0.12*(1.0/(1+aa))*Math.tanh(lo.tic(  getV(snd,k-perd ))))
			snd[k] = A * Math.sin(3*th+  fl.tic(v-0.7*getV(snd,k-perd*1.11)) ) 
		    acc = 0.999 * acc + 0.001*snd[k]*snd[k]
			t+=dt
			 
		}
		
		normalise(snd,0.2)
		return snd
	}
	
	
}