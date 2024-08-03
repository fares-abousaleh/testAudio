 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/
 
var rate = 44100 

var audio_context = undefined

 

function stopSnd()
{
	if(audio_context == undefined) return;
	audio_context.suspend();
	audio_context.close();
	audio_context=undefined;	
}

function playSnd(buf){
  initAudio()
  var source  = audio_context.createBuffer(1,buf.length,rate);
  source.copyToChannel(buf,0,0);
  var oup = audio_context.createBufferSource();
  oup.buffer = source;
  oup.connect(audio_context.destination);
  oup.start(0);
}

function initAudio(){
	if(!audio_context) audio_context = new AudioContext();
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
    ww[22+k]=Math.round(30000*data[k]+Math.random()-0.5);
   //ww.set(new Int16Array(scale(data,30000)),22);
   saveArray(ww,name+".wav","bin");
}


function Filter(){
    this.x = [0,0,0];
    this.y = [0,0,0];
	this.a = [1,0,0];
    this.b = [1,0,0];
    this.G = 1;
   this.designRes = function(fr,bw){
	 var R = Math.exp(-Math.PI*bw/rate);
     var h = 2*R*Math.cos(2*Math.PI*fr/rate);
     this.a = [1,0,0];
     this.b = [1,h,-R*R];
     this.G = (1-R)/(1+0.6*h);
   }
   this.designNotchRes = function(frn,bwn,fr,bw){
	 var Rn = Math.exp(-Math.PI*bwn/rate);
     var hn = 2*Rn*Math.cos(2*Math.PI*frn/rate);
     var R  = Math.exp(-Math.PI*bw/rate);
     var h  = 2*R*Math.cos(2*Math.PI*fr/rate);
     this.a = [1,-hn,Rn*Rn];
     this.b = [1,h,-R*R];
     this.G = (1-R)/(1+0.6*h);
   }
   this.designFracDelay = function(d){
     //console.log("actual delay d=",d);
     var nu  = (1-d)/(1+d);
     this.a = [nu,1,0];
	 this.b = [1,-nu,0];
	 this.G = 1;
   }
   this.designAllPass = function(fr){
		//var wp = 2*Math.PI*fr/rate;
        var B  = 1-2.0*fr/rate;//(1-wp)/(1+wp);
		this.a = [B,-1,0];
		this.b = [1,B,0];
		this.G = 1;
   }
   this.designLowPass = function(g){
		this.a = [1-g,0,0];
		this.b = [1,g,0];
		this.G = 1;
   }
   this.designLowPassFr = function(fr){
	    var g = Math.exp(-2*fr*Math.PI/rate);
		this.a = [1-g,0,0];
		this.b = [1,g,0];
		this.G = 1;
   }
    this.designLowPassZ = function(g){
		this.a = [1,g,0];
		this.b = [1,0,0];
		this.G = 1.0/(1.0+g);
   }
   this.designDCKill = function(g){
		this.a = [1,-1,0];
		this.b = [1,g,0];
		this.G = 1.0;
   }
   this.tic = function(v){
		var oup = this.a[0]*v        
		         +this.a[1]*this.x[1]
				 +this.a[2]*this.x[2]
		         +this.b[1]*this.y[1]
				 +this.b[2]*this.y[2];
		this.y[2]=this.y[1];
		this.y[1]=oup;
		this.x[2]=this.x[1];
		this.x[1]=v;
		return oup*this.G;	
    }
	this.tics =function(bb){
		for(var k=0;k<bb.length;k++)
			bb[k] = this.tic(bb[k]);
	}
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