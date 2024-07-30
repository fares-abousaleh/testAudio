
export
var rate = 44100 

var audio_context = undefined

var snd = makeSound(500)

var isPlaying = false

var sndBom = [makeBom(69000,0.9999,400),makeBom(69000,0.9999,950),makeBom(69000,0.9999,660),makeBom(69000,0.999,460),]

function makeBom(N=8000,g=0.96,L=400){
	
	let snd = new Float32Array(N)
	
	let a =1
	let v = 0
	const d = 1.0 / N
	let lop = 0.1
	
	for(let k=0;k<snd.length;k++,a*=g,lop+=0.06-0.1*lop)
	{
		v = v*lop+(1-lop)* a  * rnd()
		snd[k] = (1-k*d)*v-0.9*(k>L?snd[k-rndInt(0.95*L,L)]:0)
	}
	
	return snd
	
}
export
function stopSnd()
{
	if(audio_context == undefined) return;
	audio_context.suspend();
	audio_context.close();
	audio_context=undefined;	
}
export
function playSnd(buf){
  initAudio()
  //if(isPlaying)return
  //isPlaying=true
  //setTimeout(function(){isPlaying=false},300)
  var source  = audio_context.createBuffer(1,buf.length,rate);
  source.copyToChannel(buf,0,0);
  var oup = audio_context.createBufferSource();
  oup.buffer = source;
  oup.connect(audio_context.destination);
  oup.start(0);
}

function makeSound(fr){
	if(fr==undefined) fr = 500
	let snd = new Float32Array(60000)
	let a =1
	let th =0
	let dth = Math.PI*2*fr/rate
	const dth0 = Math.PI*4*fr/rate
	for(let k=0;k<snd.length;k++){
		snd[k] = sat(0.1*th,0,1)*Math.sin(th)*a
		th += dth
		dth += 0.001*(dth0-dth)
		a *=0.99883
	}
	return snd
}

function initAudio(){
	if(!audio_context) audio_context = new AudioContext();
} 

// const musicSad = document.getElementById("musicSad")
// const musicHappy = document.getElementById("musicHappy")

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
export
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
    ww[22+k]=Math.round(30000*data[k]+Math.random()-0.5);
   //ww.set(new Int16Array(scale(data,30000)),22);
   saveArray(ww,name+".wav","bin");
}