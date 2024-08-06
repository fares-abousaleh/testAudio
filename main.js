 /*----------------------------
     author: Fares-Abousaleh  
   -----------------------------*/

const snd1 = new Float32Array(13*rate)

const snd2 = new Float32Array(13*rate)

const snd3 = new Float32Array(13*rate)

const ins1 = new InsSqr(925, 2119 )

const ins2 = new InsStr(1330, 513.1,0.26,0.99999  )

const ins3 = new InsDrm()

 /*------------------------------------------
     compile notes in input <inp>
	 to buffer <snd> using intrument <ins>
   ------------------------------------------*/
   
function run(snd,ins,inp){
	initAudio()  
	snd.fill(0)
	let res = makeMusic(snd,inp.value,parseFloat(tunit_inp.value) ,ins)
	if(!res)alert("errors in notes")
	if(ins==ins1){
		addEcho(snd,0.27   , 0.1     )
		addEcho(snd,0.271  , -0.11  )
		addEcho(snd,0.2371 , -0.12  )
		addEcho(snd,0.23   , 0.1    )
	}
	normalise(snd,0.24)
	playSnd(snd)
}

document.body.onload = function(){ 
	inp1.value = " + 3cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- g Ff1eDdCc cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- "
	inp2.value =  inp1.value
	inp3.value = "3f1F4g1G2a1g1db 3f1F4g1G2a1g1db  3f1F4g1G2a1g1db  3f1F4g1G2a1g1db    "
	tunit_inp.value = "0.15"
}

vol_progress.onmousedown=function(e){
	initAudio()
	if(e.buttons!=1)return
	const r = vol_progress.getBoundingClientRect()
	let x = e.pageX - r.left
	vol_progress.value = Math.round( x * 100.0 / (r.right-r.left) ) 
	setVolume(0.01*vol_progress.value)
}

vol_progress.onmousemove = vol_progress.onmousedown