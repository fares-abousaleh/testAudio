 
 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/

const BaseFr = 261.3
var   Transp = 1.0
let  lastPos = 0 
let  startPos = 0
let  tunit = 0.2

function resetPos(){
	lastPos = 0
	startPos = 0
	tunit = 0.2
}

function advancePos(){
	startPos = lastPos
}

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

function defSteps(s){
	let keys ={}
	const ss = s.trim().replaceAll("\n"," ").split(/ +/)
	const step = 1.0 / parseFloat(ss[0])
	let t = 0
	for(let k=1;k<ss.length;k+=2){
		keys[ss[k]] = Math.pow(2,t*step)
		t += parseFloat(ss[k+1])
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
	let notes = []
	let vols = [{vl:0.5,pos:0}]
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
		if('0123456789'.search(s[k])>=0){
			vol=parseFloat(s[k])/10.0
			vols.push({vl:vol,pos:pos+tm})
		}
		else if(s[k]==':'){
			k++
			if('0123456789'.search(s[k])>=0)
			dtn = dt/parseInt(s[k])
			else return false 
		}
		else{
			if(tm!=0){
				if(nt!=',')
					//mixSnd( dest,ins.get(nt,oc,tm),pos,vl  )
				    notes.push({nt:nt,oc:oc,tm:tm,pos:pos})
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
	lastPos = Math.max(pos,lastPos+startPos )
	
	if(notes.length==0)return true
	if(vols.length==1)vols.push({vl:0.5,pos:notes[notes.length-1].pos})
	console.log(notes) 
	
	for(let k=0;k<notes.length;k++){
		let nt = notes[k]
		 
		 
		for(let i=0;i<vols.length;i++)
			if(vols[i].pos>nt.pos&&i>0){
				vl = vols[i-1].vl +(nt.pos-vols[i-1].pos)* (vols[i].vl-vols[i-1].vl)/(vols[i].pos-vols[i-1].pos)
				break;
			}
		 
		//console.log(vl)
		mixSnd( dest,ins.get(nt.nt,nt.oc,nt.tm),nt.pos+startPos,vl  )
	}
	
	return true
}

/*-------------------
function makeMusic1(dest,s,dt=1,ins,strt=0){
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
-------------------*/

const stdStepsStr = "6 c 0.5 C 0.5 d 0.5 D 0.25 u 0.25 e 0.5 f 0.5 F 0.5 g 0.5 G 0.5 v 0.25 a 0.5 A 0.25 w 0.25 b 0.5"
const stdkeysStr = "6 s 6 m -6 c 0 C 0.5 d 1 D 1.5 u 1.75 e 2 f 2.5 F 3 g 3.5 G 4 v 4.25 a 4.5 A 5 w 5.25 b 5.5"
var stdkeys = defScale(stdkeysStr)
	
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
		for(let i=0;i<this.N;i++)
			this.imp[i] = rnd()/(i*0.001+1)
	}
	
	
	get(nt,oct,len){
		 
		let snd = new Float32Array( this.N)
		let fr =  freq(nt,oct) 
		let perd =  rate *1.0/ fr
		 
		 
		var ext = 0
		 
		var mx = 0;
		const dck = new Filter()
		dck.designDCKill(0.95)
		 let lowp = new Filter()
		 lowp.designLowPass( this.lopg  )
		  
		 const res1 = new Filter()
		 const res2 = new Filter()
		 res1.designRes(this.frm1,  1.42* this.frm1)
		 res2.designRes(this.frm2, 2.5* this.frm2)
		 const res = new Filter()
		 res.designRes(fr  ,  fr)
		 let g  = Math.pow(0.1,perd*1.0/snd.length)
		const lo = new Filter()
		lo.designLowPass(0.9*sat(600.0/fr,0.3,0.9))
		const r = rnd(0,this.imp.length/3)
		let dec1 = 1, dec2 = 1
		let atk = 0 
		let A = 1,a=9
		let th = 0
		const dth = 2*fr*Math.PI/rate
		const w1 = fr*this.frm1 *2*Math.PI /rate
		const w2 = fr*this.frm2 *2*Math.PI /rate
		let thh = 0
		let v = 0 
		let kk =0 
		for(let k=0;k<snd.length;k++){
			  if(k<perd/2)v = rnd(0.6,1);
				     else v = 0
			  v = dck.tic(v)
			  v = lo.tic(v)
			  v += this.g * lowp.tic ( getV(snd,k-perd) )
			  snd[k] = v
			  mx = Math.max(Math.abs(v),mx)
		}
		snd = snd.subarray(1000)
		for(let k=0;k<200;k++)
			snd[k]*=k*0.005
		addEcho( snd, 1.5   /fr, -0.261 )
		addEcho( snd, 1.3333/fr, -0.376 )
		normalise( snd, 0.3 )
		
		
		
		//console.log("str made so far:",this.hist)
	return snd 
	}
	
}


class InsWind{
	
	constructor(cf){
		this.cf = cf
	}
	
	
	get(nt,oct,tm){
		const fr = freq(nt,oct)
		const perd =  rate*1.0/fr
		let dth = fr*2*Math.PI/rate
		let   th = 0 
		const n = Math.ceil(tm*rate)
		const snd = new Float32Array(n)
		let   t = 0 
		const dt = 2*Math.PI/rate
		const fl = new Filter()
		const cf  = 300.0/fr
		fl.designDCKill(0.95)
		const va = 1.0/1024
		const vb = 2.0/1024
		let v = 0
		let feed1 = 1.0/(3-sat(tm,0,2.3))
		let feed2 = 1.0/(3-sat(tm,0,2.3))
		
		for(let k=0;k<n;k++){
			let vb1 = Math.sin(3*t)
			let vb2 = Math.sin(7*t)
			let A = Math.tanh((2+0.2*vb1-0.1*vb2)*Math.sin(k*Math.PI/n))
			t+=dt 
			v = A * Math.sin(th+v*(feed1)*Math.sin(2.005*th))
			v += A* Math.sin(2*th+A*v*(feed2)*Math.sin(3.005*th))
			th += dth   *(1+A*(va*vb1-vb*vb2)*100.0/perd)
			feed1 /=1+feed1*0.000001 
			feed2 /=1+feed2*0.00001
			snd[k] =   fl.tic(  v  )
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
		
		const loo = new Filter() 
		loo.designLowPass(0.4)
		
		
		
		let v = 0
		
		for(let k=0;k<n;k++){
			let vib1 = Math.sin(5*t)
			let vib2 = Math.sin(7*t)
			let A = Math.tanh(( 3+0.8*vib1+0.7*vib2)*Math.sin(k*Math.PI/n))
			let vv = loo.tic( getV(snd,k-perd*1.25  ) )
			v = A * Math.sin(th+A*vv) 
			v = Math.tanh( v) 
			th += dth * ( 1 +0.0215* v    )
			snd[k] =      v     
			t+=dt
		}
		
		
		
		normalise(snd,0.242)
		return snd
	}
	
	
}



class InsBass{
	
	constructor(){
		
	}
	
	f(x){
		return x-x*x+x*x*x
	}		
	
	get(nt,oct,tm){
		 
		
		const n = Math.ceil( tm * rate ) 
		const snd = new Float32Array(n)
		const fr = freq(nt,oct)
		const perd = rate/fr
		let th = 0
		let dth = fr*2*Math.PI/rate
		const g = Math.pow(0.1,1/n)
		const fl = new Filter()
		const lo = new Filter()
		fl.designDCKill(0.95)
		lo.designLowPass(0.8)
		let A = 1.0
		let atk =0
		let v=0
		for(let k=0;k<n;k++){
			v = atk*A*((k+0.1*v)%perd)/perd
			v=lo.tic(fl.tic(v))
			A *= g
			th+=dth
			if(atk<1) atk+=0.01
			snd[k] =v 
		}
			
		
		normalise(snd,0.2)
		return snd
	
	}
	
}
