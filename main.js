const snd1 = new Float32Array(10*rate)

const snd2 = new Float32Array(10*rate)

const ins1 = new InsSqr(4,7)

const ins2 = new InsSqr(5,9)

function run(snd,ins,inp){
	snd.fill(0)
	makeMusic(snd,stdkeys ,inp.value,0.1 ,ins)
	addEcho(snd,0.13,0.26)
	addEcho(snd,0.1712,-0.196)
	addEcho(snd,0.03712,-0.296)
	normalise(snd)
	playSnd(snd)
}

document.body.onload = function(){
	inp1.value = " -cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- g Ff1eDdCc cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- "
	inp2.value = " --  5c... ,,1c.   5c... ,,1c. 5c.2D. 4g..1d  5c... ,,1c.   5c... ,,1c. 5c.2D. 4g..1d"
}