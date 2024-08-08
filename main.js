 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/
const scl    =  ['c','C','d','D','e','f','F','g','G','a','A','b']

const sclclr =  [1,0,1,0,1,1,0,1,0,1,0,1]

const sclN = 30

const snd1 = new Float32Array(13*rate)

const snd2 = new Float32Array(13*rate)

const snd3 = new Float32Array(13*rate)

const ins1 = new InsSqr(725, 2319 )

const ins2 = new InsStr(1330, 513.1,0.26,0.99999  )

const ins3 = new InsDrm()

 /*------------------------------------------
     compile notes in input <inp>
	 to buffer <snd> using intrument <ins>
   ------------------------------------------*/
   
function run(snd,ins,inp){
	initAudio()
	setVolume(0.01*vol_progress.value)
	snd.fill(0)
	let res = makeMusic(snd,inp.value,parseFloat(tunit_inp.value) ,ins)
	if(!res)alert("errors in notes")
	if(ins==ins1){
		addEcho(snd,0.517   , 0.042     )
		addEcho(snd,0.3371  , -0.081  )
		addEcho(snd,0.35371 , -0.099   )
		addEcho(snd,0.293   , 0.12    )
	}
	normalise(snd,0.24)
	playSnd(snd)
}

document.body.onload = function(){ 
	inp1.value = " + 3cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- g Ff1eDdCc cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- "
	inp2.value =  inp1.value
	inp3.value = "3f1F4g1G2a1g1db 3f1F4g1G2a1g1db  3f1F4g1G2a1g1db  3f1F4g1G2a1g1db    "
	tunit_inp.value = "0.18"
	window.onresize()
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
	const clr = ["#200","#400"]
	let x = 0
	const N = sclN
	const dx = can.width *1.0 / N
	ctx.font=""+Math.floor(dx/2)+"pt   Calibri"
	ctx.strokeStyle="#e00"
	ctx.lineWidth=1
	
	for(let k=0;k<N;k++){
		ctx.fillStyle=clr[sclclr[k%scl.length]]
		ctx.fillRect(x,0,dx,can.height)
		ctx.strokeRect(x,0,dx,can.height)
		ctx.strokeText(scl[k%scl.length],x+dx/4,can.height*0.8 )
		x+=dx
	}
	ctx.strokeStyle="#e20"
	const uvw=[3,8,10]
	const s =['u','v','w']
	for(let k=0;k<N;k++){
		let x = (uvw[k%3]+Math.floor(k/3)*12)*dx
		if(x>can.width)break
		//ctx.strokeRect(x,0,dx,can.height)
		ctx.strokeText(s[k%3],x+dx/4,can.height*0.31 )
	}
}

can.onmousedown=function(e){
	initAudio()
	const N = sclN
	const dx = can.getBoundingClientRect().width * 1.0 / N
	let x = e.x - can.getBoundingClientRect().x
	let y = e.y - can.getBoundingClientRect().y
	
	x = Math.floor( x *1.0/ dx )
	console.log(x)
	let oct = Math.floor(x /scl.length )+4
	let nt = scl[x%scl.length]
	let i = 'DGA'.search(nt)
	if(i>=0&&y<can.getBoundingClientRect().height/2){
		nt='uvw'[i]
	}
	let d = ins.get(nt,oct,0.61) 
	normalise(d,getVolume()*0.25)
	playSnd(d )
	//playSnd( ins.get(rndElement(['c','C','d']),4,0.61) )
}
window.onresize=function(){
	can.width =  Math.round(0.84*window.innerWidth)
	drawCan()
}
vol_progress.onmousemove = vol_progress.onmousedown