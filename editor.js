
const snd = new Float32Array(53*rate)



const Ins = []

function newIns(head){
	switch(head){
		case 'wind' : return new InsWind([2221 ,900,1521])
		case 'str'  : return new InsStr(1.11,  2.1,0.121,0.997,2.1   )
		case 'bass' : return new InsStr(1.20,  1.1,0.24,0.997,2.2)
		case 'perc' : return new InsDrm()
		default: return undefined
	}
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
		 
		ins = newIns(head)
		if(ins==undefined) {
			alert('error at line '+i)
			return
		}
		makeMusic(snd,tail,tunit,ins)
	}
	addEcho(snd, 0.517   , +0.042  )
		addEcho(snd, 0.3371  , -0.081  )
		addEcho(snd, 0.35371 , -0.099  )
		addEcho(snd, 0.293   , +0.12   )
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
	tx_notes.value  = "wind  ++3c............-1b+3c..2C3c...-gF.....A+C-A..F...1feF..+c-c..\n "
	                + "str   1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b 4FACFF3ACFFAC2FFACFF1ACFFACFFACF1c2D2g1b1c2D2g1b\n"
}