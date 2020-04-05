let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let WIDTH = canvas.width;
let HEIGHT = canvas.height;

let flocks=[];

class Boid {
  constructor(velocity = null, position = null) {
    if (velocity === null) {
      let min = -4;
      let max =-1;
      let x = Math.floor(Math.random() * (max - min + 1) + min)+1;
      let y = Math.floor(Math.random() * (max - min + 1) + min)+1;
      this.velocity = new Victor(x, y);
    } else this.velocity = velocity;

    if (position === null) {
      let min = 1;
      let x = Math.floor(Math.random() * (WIDTH - min + 1) + min);
      let y = Math.floor(Math.random() * (HEIGHT - min + 1) + min);
      this.position = new Victor(x, y);
    } else this.position = position;
    this.acceleration = new Victor(0,0);
    this.maxForce=1;
    this.maxSpeed=4;
  }

  edges (){
    if (this.position.x>WIDTH)
      this.position.x=0;
    else if (this.position.x<0)
      this.position.x=WIDTH;
    
    if (this.position.y>HEIGHT)
      this.position.y=0;
    else if (this.position.y<0)
      this.position.y=HEIGHT;
  }

  align(boids){
    let perceptionRadius = 60;
    let steering = new Victor();
    let total =0;
    for (let other of boids ){
      let d= (this.position.distance(other.position));
      if (other!==this && d<perceptionRadius){
        steering.add(other.position);
        total++;
      }
    }
    if (total>0){
      steering.x/=total;
      steering.y/=total;
      steering.subtract(this.velocity);
      steering.limit(1,0.001);
    }
    return steering; 

  }
  calculateAcceleration (){
    let alignment=this.align(flocks);

    this.acceleration.add(alignment); 
  

  }

  update (){
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed,0.5);
    this.acceleration=new Victor(0,0); 
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

for (let i=0;i<40;i++){
  let temp = new Boid();
  flocks.push(temp);
}

function loop (){
  ctx.clearRect(0,0,WIDTH,HEIGHT);
  for (let boid of flocks){
    boid.draw(); 
    //boid.calculateAcceleration();
    boid.update(); 
    boid.edges();
  }
}

setInterval(loop,30);