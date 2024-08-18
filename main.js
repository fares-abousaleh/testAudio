
const snd = new Float32Array(53*rate)



const Ins = {
     'wind': new InsWind([2221 ,900,1521]),
     'str' : new InsStr(765,  2321,0.221,0.9947,2.1 ),
	 'bass': new InsStr(454,  905,0.5 ,0.994 ,1.5),
	 'perc': new InsDrm(),
}


function logMessage(s){
	tx_log.value+= "\n"+s
}

function runMusic(){
	
	resetPos()
	let lines = tx_notes.value.trim().split(/\n+/)
	var ins 
	snd.fill(0)
	
	for(let i=0;i<lines.length;i++){
		 
		let curline = lines[i].trim()
		let ind = curline.indexOf('//')
		if(ind>=0)curline = curline.substr(0,ind)
    
		let head = chopHead(curline)
		let tail = curline.substr(head.length).trim()
		
		if(head=='')continue
		if(head=='next'){
			advancePos()
			continue
		}
		if(head=='tempo'){
			let tempo = parseFloat(tail)
			if(tempo==undefined|tempo<=0){
				alert('wrong tempo') 
				return false
			}
			tunit = 1.0 / tempo  
			continue
		}
		 
		ins = Ins[head]
		if(ins==undefined) {
			alert('error at line '+i)
			return
		}
		makeMusic(snd,tail,tunit,ins)
	}
	addEcho(snd, rate/31  , +0.142  )
		addEcho(snd, rate/21  , -0.181  )
		addEcho(snd, rate/121 , -0.2199  )
		addEcho(snd, rate/34   , +0.112   )
	normalise(snd,0.95)
	playSnd(snd)
}

function loadScore(){
	 
	loadTextAreaFromFile( tx_notes )
}

function saveScore(){
	saveStr(tx_notes.value,'score.txt')
}
	
window.onload = function(){
	tx_notes.value  = 
	"// this is a commented line \n// -- more examples in the folder ./scoe_files\n\n"
	+	"// wind instrument :\n wind  ++3c............-1b+3c..2C3c...-gF.....A+C-A..F...1feF..+c-c..\n "
	                + "// plucked string instrument:\n str   1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b 4FACFF3ACFFAC2FFACFF1ACFFACFFACF1c2D2g1b1c2D2g1b\n"
}