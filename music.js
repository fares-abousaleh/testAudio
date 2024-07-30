//--- not fully implemented yet ...
import {playSnd,stopSnd,rate} from "./audio.js"
	
function getV(arr,t){
	if(t<0||t>=arr.length-1)return 0
	
	const a = Math.floor(t)
	const b = a+1
	
	return (b-t)*arr[a]+(t-a)*arr[b]
}

// function makeExt(){
	// let ext = new Float32Array(30000)
	// let th  = new Float32Array(45)
	// let dth = new Float32Array(th.length)
	
	// for(let i=0;i<dth.length;i++)
		// dth[i]=rnd(900,1200)*6.0/rate
	
	// for(let k=0;k<ext.length;k++)
		// for(let i=0;i<th.length;i++){
			// ext[k] += Math.sin(th[i])*Math.exp(-5*dth[i])
			// th[i]+=dth[i]
		// }
	// return ext
// }

// const Ext = makeExt()

export
function stringSound(fr,len){
	const n = Math.ceil( len * rate )
	let snd = new Float32Array(n)
	
	let perd =  rate *1.0/ fr
	let lop =0.9973
	var a = 1
	var ext = 1
	const g = Math.pow(0.01,1.0/n)
	var mx = 0;
	// var kk = rndInt(0,5000)
	let old = 0,oldd=0,ex=0
	
	for(let k=0;k<snd.length;k++,a*=g){
		 if(rndDecide(0.1))ext=rnd()/(0.001*k+1)
		 ext = 0.9*oldd+0.1*ext
		 oldd = ext
		 let b = getV(snd,k-perd/2 ) 
		  b*=1.0/(1.0+0.001*Math.abs(b))
		let u  =  ext  - b 
		u = 0.13*old+0.87*u
		old =  u
		 
		lop+=0.01*(1.0-lop)
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

function mixSnd(dest,src,pos,vol=1){
	  pos = Math.round(rate * pos)
	const n = Math.min( pos+src.length,dest.length)
	
	for(let k=pos;k<n;k++)
		dest[k]+=vol*src[k-pos]
}


function initMusic(s){
	let keys = {}
	const ss = s.trim().replaceAll("\n"," ").split(/ +/) 
	const step = 1.0 / parseFloat(ss[0])
	for(let k=1;k<ss.length;k+=2){
		keys[ss[k]] = Math.pow(2,parseFloat(ss[k+1]*step))
	}
	return keys
}

function makeMusic(dest,keys,s,dt=1,ins=makeWind){
	let oct = 0
	let tm  = dt
	let fr  = 0
	let pos = 0
	const BaseFr = 261.3
	s+="S"
	
	for(let k=0;k<s.length;k++)
		if(s[k]==' ')continue
		else
		if(s[k]=='+')oct++
		else 
		if(s[k]=='-')oct--
		else
		if(s[k]=='.')tm+=dt
		else{
			if(fr>0){
				mixSnd( dest,ins(fr,(ins===stringSound)?0.6:tm),pos )
				pos+=tm
			}
			fr = keys[s[k]] * BaseFr * Math.pow( 2, oct )
			tm = dt	
		}
}

function testMusic1(){
	let snd = stringSound(800,4)
	const dt = 0.1
	let fr = 500
	for( let k=0; k<30; k++,fr*=rnd(1.041,1.083)){
		let s = stringSound(fr,dt)
		mixSnd(snd,s,dt*k+dt,rnd(0.5,1))
	}	return snd
}

const stdkeys = initMusic("6 c 0 C 0.5 d 1 D 1.5 u 1.75 f 2.5 F 3 g 3.5 G 4 v 4.25 a 4.5 A 5 w 5.25 b 5.5")
	
function testMusic()
{
	stdkeys.m = 9/16.0
	stdkeys.s = 9/4.0
	 let dest = new Float32Array(rate * 10)
    console.log('init music..')
	makeMusic(dest,stdkeys,"defmdfacdfm-A+dfm-afesdmfedeCdm...",0.085,stringSound )
	 
	console.log('init music done')
	normalise(dest)
	 
	return dest
}

 
	

export
function makeWind(fr,L){
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
		snd[k] = Math.tanh(a*Math.sin(th+a*0.6*(2+Math.sin(r+t))*Math.sin(th)))
		th += dth * (1.0 + 0.006*Math.sin(10*t))
		t+=dt
	}
	
	return snd;
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