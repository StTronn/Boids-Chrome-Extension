let canvas=document.getElementById("canvas");
let ctx=canvas.getContext('2d');
let width = canvas.width;
let height= canvas.height;
ctx.translate(width/2,height/2);

class Vector {
    constructor(x=0,y=0){
        this.x=x;
        this.y=y;
    }

    add(v){
        let ret= new Vector(this.x+v.x,this.y+v.y);
        return ret; 
    }

    sub(v){
        let ret= new Vector(this.x-v.x,this.y-v.y);
        return ret;
    }
}

class Boid {
    constructor(velocity=null,position=null){
        if (velocity===null)
            this.velocity=new Vector(2,1);
        else 
            this.velocity=velocity;
        if (position===null)
            this.position=new Vector(0,0);
        else 
            this.position=position;
    }
    
    draw (){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,10,0,2*Math.PI);
        ctx.stroke();
    }
}

let temp = new Boid();
temp.draw();