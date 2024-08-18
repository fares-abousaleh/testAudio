 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/
 
var rate = 44100 

var audio_context = undefined

var gainNode = undefined 

function stopSnd()
{
	if(audio_context == undefined) return;
	audio_context.suspend()
	gainNode.disconnect()
	let vol = gainNode.gain.value
	delete gainNode
	gainNode = audio_context.createGain()
	gainNode.gain.value = vol
	gainNode.connect(audio_context.destination)
	audio_context.resume()
}

function playSnd(buf){
  initAudio()
  var source  = audio_context.createBuffer(1,buf.length,rate);
  source.copyToChannel(buf,0,0);
  var oup = audio_context.createBufferSource();
  oup.buffer = source;
  oup.connect(gainNode);
  oup.start(0);
}

function setVolume(v){
	gainNode.gain.value = v
}

function getVolume(v){
	return gainNode.gain.value
}

function initAudio(){
	if(audio_context!=undefined) return
	audio_context = new AudioContext();
	gainNode = audio_context.createGain()
	gainNode.gain.value = 0.1 // 10 %
	gainNode.connect(audio_context.destination)
} 

function saveArray(data, name, type) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    var file = new Blob([data], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
	document.body.removeChild(a);
	a=null;
}

function toInt16(s){
  var arr =[];
  if(typeof(s)=="string")
  { 
    for(var i=0;i<s.length;i+=2) 
    arr.push(s.charCodeAt(i)+(s.charCodeAt(i+1)<<8));
  }
  else
  { 
    arr.push(s & 0xFFFF);
    s=s>>>16;
    arr.push(s & 0xFFFF);
  }
  return new Int16Array(arr);
  }

function saveWave(name,data,rt){
   var L = data.length*2+36;
   var ww = new Int16Array(22+data.length);
   ww.set(toInt16("RIFF"),0);
   ww.set(toInt16(L),2);
   ww.set(toInt16("WAVE"),4);
   ww.set(toInt16("fmt "),6);
   ww.set(toInt16(16),8);
   ww.set(toInt16(0x00010001),10);
   ww.set(toInt16(rt),12);
   ww.set(toInt16(2*rt),14);
   ww.set(toInt16(0x00100002),16);
   ww.set(toInt16("data"),18);
   ww.set(toInt16(2*data.length),20); 
   for(var k=0;k<data.length;k++)
    ww[22+k]=Math.round(32000*data[k]);
   //ww.set(new Int16Array(scale(data,30000)),22);
   saveArray(ww,name+".wav","bin");
}

/*-----------------------------------------
	Linear Interpolation: 
	get value of <arr> at position <t>
	returns 0 if t < 0 or t >= length of array
  ----------------------------------------*/
function getV(arr,t){
	if(t<0||t>=arr.length-1)return 0
	
	const a = Math.floor(t)
	const b = a+1
	
	return (b-t)*arr[a]+(t-a)*arr[b]
}
/*-----------------------------------------
	Adds echo to sound: 
	<s> float32 array 
	<t> is time delay in seconds
	<g> coefficent in interval ]0,1[
  ----------------------------------------*/
function addEcho(s,t,g){
	t = t*rate
	for(let k=0;k<s.length;k++){
		if(k>s.length-3000)g*=0.999
		s[k] += g * getV(s,k-t)
	}
}
/*-----------------------------------------
	Mix sound <src> into sound <dest>
	at position <pos> in seconds.
	Mixed sound <src> will be multiplyed 
	by <vol> coefficent.
  ----------------------------------------*/
function mixSnd(dest,src,pos,vol=1){
	  pos = Math.round(rate * pos)
	const n = Math.min( pos+src.length,dest.length)
	
	for(let k=pos;k<n;k++)
		dest[k]+=vol*src[k-pos]
	 
}

/*-----------------------------------------
	Scale array <v> of floats.  
	The new max abs value will be <vol>
  ----------------------------------------*/
function normalise(v,vol=1.0){
	let mx = 0
	for(let k=0;k<v.length;k++)
		mx = Math.max(mx,Math.abs(v[k]))
	if(mx==0)return
	
	mx=vol/mx
	for(let k=0;k<v.length;k++)
		v[k]*=mx
}

function addPhasing(snd,spd,vol){
	let t = 0
	for(let k=0;k<snd.length;k++,t+=spd){
		snd[k] += vol*getV(snd,k+Math.sin(k*spd*6.0/rate))
	}
}