 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/
const scl    =  [
		 [ 'c','d','u','f','g','a','w' ],
		 [ 'C','D',' ','F','G','A',' ' ],
         [ 'c','d','e','f','g','a','b' ],
		 [ 'd','D','f','g','v','A','b' ],
		 ]


const sclN = 30

const Length = 25 //seconds

const snd1 = new Float32Array(Length*rate)

const snd2 = new Float32Array(Length*rate)

const snd3 = new Float32Array(Length*rate)

const sndMix = new Float32Array(Length*rate)

const ins1 = new InsWind([2221 ,900,1521])

const ins2 = new  InsStr(1030,  2513.1,0.31,0.99992  )

const ins3 = new InsDrm()
//const ins3 = new InsBass()

 /*------------------------------------------
     compile notes in input <inp>
	 to buffer <snd> using intrument <ins>
   ------------------------------------------*/
   
function run(snd,ins,inp,n){
	initAudio()
	setVolume(0.01*vol_progress.value)
	snd.fill(0)
	let res = makeMusic(snd,inp.value,parseFloat(tunit_inp.value) ,ins,n)
	if(!res)alert("errors in notes")
	if(ins==ins1){
		addEcho(snd, 0.517   , +0.042  )
		addEcho(snd, 0.3371  , -0.081  )
		addEcho(snd, 0.35371 , -0.099  )
		addEcho(snd, 0.293   , +0.12   )
	}
	normalise(snd,0.24)
	playSnd(snd)
}



vol_progress.onmousedown=function(e){
	initAudio()
	if(e.buttons!=1)return
	const xx = vol_progress.getBoundingClientRect().x
	const ww = vol_progress.getBoundingClientRect().width
	let x = e.x - xx
	vol_progress.value = Math.round( x * 100.0 / ww ) 
	setVolume(0.01*vol_progress.value)
}

let can = document.createElement('canvas')
can.setAttribute("class","CANVAS")
can.width= window.innerWidth*0.8
can.height=100
let ctx = can.getContext('2d')

let ins = ins1


inp1.onfocus = function(){
	keyboard_1.appendChild(can)
	ins=ins1
	drawCan()
}

inp1.onfocus()

inp2.onfocus = function(){
	keyboard_2.appendChild(can)
	ins=ins2
	drawCan()
}

inp3.onfocus = function(){
	keyboard_3.appendChild(can)
	ins=ins3
	drawCan()
}



function drawCan(){
	const clr = ["#100","#400", ]
	 
	const N = sclN
	const dx = can.width *1.0 / N
	const dy = can.height *1.0/4
	ctx.font=""+Math.floor(dx/2)+"pt   Calibri"
	ctx.strokeStyle="#e00"
	ctx.lineWidth=1
	
	 
	for(let i=0;i<scl.length;i++){
	for(let k=0;k<N;k++){
		ctx.fillStyle=clr[(k/scl[i].length)%clr.length]
		ctx.fillRect  (k*dx, i*dy, dx, dy)
		ctx.strokeRect(k*dx, i*dy, dx, dy)
		ctx.strokeText(scl[i][k%scl[i].length],k*dx+dx/4,dy*i+dy*0.8 )
		 
	  }
	}
	 
}

can.onmousedown=function(e){
	initAudio()
	setVolume(vol_progress.value*0.01)
	const N = sclN
	const dx = can.getBoundingClientRect().width * 1.0 / N
	const dy = can.getBoundingClientRect().height * 1.0 / scl.length
	let x = e.x - can.getBoundingClientRect().x
	let y = e.y - can.getBoundingClientRect().y
	
	x = Math.floor( x *1.0/ dx )
	y = Math.floor( y *1.0/ dy )
	console.log(dy,y)
	let oct = Math.floor(x /scl[y].length )+4
	let nt = scl[y][x%scl[y].length]
	if(nt==' ')return
	let d = ins.get(nt,oct,0.61) 
	normalise(d,getVolume()*0.25)
	playSnd(d )
	//playSnd( ins.get(rndElement(['c','C','d']),4,0.61) )
}
window.onresize=function(){
	can.width =  Math.round(0.84*window.innerWidth)
	drawCan()
}

inp1.onclick=function(e){
	if(!e.ctrlKey)return
	const inp = e.target
	const n = e.target.selectionStart
	run(snd1,ins1,inp1,n)
	
}

vol_progress.onmousemove = vol_progress.onmousedown

function btnMix(){
	sndMix.fill(0)
	mixSnd( sndMix, snd1,0)
	mixSnd( sndMix, snd2,0)
	mixSnd( sndMix, snd3,0)
	normalise(sndMix,0.6)
	playSnd(sndMix)
}

document.body.onload = function(){ 
	inp1.value = someNotes[0]
	inp2.value =  someNotes[1]
	inp3.value = somePercussions[2]
	inp_scl.value = stdStepsStr
	tunit_inp.value = "0.18"
	window.onresize()
}