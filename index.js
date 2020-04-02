let canvas=document.getElementById("canvas");
let ctx=canvas.getContext('2d');

let WIDTH = canvas.width;
let HEIGHT= canvas.height;

class Vector {
    constructor(x=WIDTH/2,y=HEIGHT/2){
        this.x=x;
        this.y=y;
    }

    add(v){
        let ret = new Vector(this.x + v.x, this.y + v.y);
        if (ret.x < 0)
            ret.x = WIDTH,ret.y=Math.abs(ret.y-HEIGHT);
        if (ret.x > WIDTH)
            ret.x = 0,ret.y=Math.abs(ret.y-HEIGHT);
        if (ret.y < 0)
            ret.y = HEIGHT,ret.x=Math.abs(ret.x-WIDTH);
        if (ret.y > HEIGHT)
            ret.y = 0,ret.x=Math.abs(ret.x-WIDTH);
        return ret; 
    }

    sub(v){
        let ret = new Vector(this.x - v.x, this.y - v.y);
        if (ret.x < 0)
            ret.x = WIDTH;
        if (ret.x > WIDTH)
            ret.x = 0;
        if (ret.y < 0)
            ret.y = HEIGHT;
        if (ret.y > HEIGHT)
            ret.y = 0;
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
            this.position=new Vector();
        else 
            this.position=position;
    }
    
    draw (){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,4,0,2*Math.PI);
        ctx.stroke();
    }
}

let flock=[];
let temp = new Boid();
flock.push(temp);
temp.draw();

function drawAllBoids() {
    ctx.clearRect(0,0,WIDTH,HEIGHT); 
    for (let boid of flock) {
        boid.draw();
    }
}

function moveAllBoids() {
    for (let boid of flock){
        boid.position=boid.position.add(boid.velocity);
    }
}

function loop() {
    drawAllBoids();
    //move all boids
    moveAllBoids();
}