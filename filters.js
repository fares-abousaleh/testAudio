/*---------------------------------
	Audio Filters
 *---------------------------------*/

function Filter(){
    
	this.x = [0,0,0];
    this.y = [0,0,0];
	this.a = [1,0,0];
    this.b = [1,0,0];
    this.G = 1;
   
   //-- pass band resonator center freq <fr> Hz
   //   bandwidth = <bw> Hz
   this.designRes = function(fr,bw){
	 var R = Math.exp(-Math.PI*bw/rate);
     var h = 2*R*Math.cos(2*Math.PI*fr/rate);
     this.a = [1,0,0];
     this.b = [1,h,-R*R];
     this.G = (1-R)/(1+0.6*h);
   }
   
   this.designFracDelay = function(d){
     var nu  = (1-d)/(1+d);
     this.a = [nu,1,0];
	 this.b = [1,-nu,0];
	 this.G = 1;
   }
   
   this.designAllPass = function(fr){
	     var B  = 1-2.0*fr/rate;//(1-wp)/(1+wp);
		this.a = [B,-1,0];
		this.b = [1,B,0];
		this.G = 1;
   }
   
   //-- low pass IIR with one pole at <g>
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