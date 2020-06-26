let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize, false);
resize();

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FLOCK_SIZE = 140;

let flocks = [];

class Boid {
  constructor(velocity = null, position = null) {
    if (velocity === null) {
      let min = 2;
      let max = 3;
      this.angle = Math.random() * 2 * Math.PI;
      let x = Math.cos(this.angle);
      let y = Math.sin(this.angle);

      this.velocity = new Victor(x, y);
      setMagnitude(this.velocity, 3);
    } else this.velocity = velocity;

    if (position === null) {
      let min = 1;
      let x = Math.floor(Math.random() * (WIDTH - min + 1) + min);
      let y = Math.floor(Math.random() * (HEIGHT - min + 1) + min);
      this.position = new Victor(x, y);
    } else this.position = position;
    this.acceleration = new Victor(0, 0);
    this.maxForce = 0.4;
    this.maxSpeed = 3.5;
  }

  edges() {
    if (this.position.x > WIDTH) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = WIDTH;

    if (this.position.y > HEIGHT) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = HEIGHT;
  }

  align(boids) {
    let perceptionRadius = 60;
    let steering = new Victor();
    let total = 0;
    for (let other of boids) {
      let d = this.position.distance(other.position);
      if (other !== this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      setMagnitude(steering, this.maxSpeed);
      steering.subtract(this.velocity);
      limit(steering, this.maxForce);
    }
    return steering;
  }

  cohesion() {
    let perceptionRadius = 80;
    let steering = new Victor();
    let total = 0;

    for (let other of flocks) {
      let d = Math.abs(this.position.distance(other.position));
      if (other !== this && d < perceptionRadius) {
        steering.add(other.position);
        total = total + 1;
      }
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      steering.subtract(this.position);
      setMagnitude(steering, this.maxSpeed);
      steering.subtract(this.velocity);
      limit(steering, this.maxForce);
    }
    return steering;
  }
  separation() {
    let perceptionRadius = 60;
    let steering = new Victor();
    let total = 0;

    for (let other of flocks) {
      let d = Math.abs(this.position.distance(other.position));
      if (other !== this && d < perceptionRadius) {
        let diff = this.position.clone();
        diff.subtract(other.position);
        diff.x /= d * d;
        diff.y /= d * d;
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      setMagnitude(steering, this.maxSpeed);
      steering.subtract(this.velocity);
      limit(steering, 0.5);
    }
    return steering;
  }

  calculateAcceleration() {
    let alignment = this.align(flocks);
    let cohesion = this.cohesion();
    let separation = this.separation();

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    limit(this.velocity, this.maxSpeed);
    this.velocity.add(this.acceleration);
    this.acceleration = new Victor(0, 0);
  }

  draw() {
    let delta = 4;
    let angle = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
    let p = { x: this.position.x, y: this.position.y };
    //top vertex of triangle
    let v1 = { x: p.x, y: p.y - delta };
    let v2 = { x: p.x - delta, y: p.y + delta };
    let v3 = { x: p.x + delta, y: p.y + delta };
    v1 = rotate(v1, p, angle);
    v2 = rotate(v2, p, angle);
    v3 = rotate(v3, p, angle);

    ctx.beginPath();
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.lineTo(v1.x, v1.y);

    // ctx.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI);
    // ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

for (let i = 0; i < FLOCK_SIZE; i++) {
  let temp = new Boid();
  flocks.push(temp);
}

function loop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let boid of flocks) {
    boid.draw();
    boid.calculateAcceleration();
    boid.update();
    boid.edges();
  }
}

setInterval(loop, 30);

function setMagnitude(v, m) {
  let mag = Math.sqrt(v.x * v.x + v.y * v.y);
  v.x *= m / mag;
  v.y *= m / mag;
}

function limit(v, max) {
  let length = v.length();
  if (length > max) {
    v.x = (v.x * max) / length;
    v.y = (v.y * max) / length;
  }
}

function rotate(point, pivot, angle) {
  let s = Math.sin(angle);
  let c = Math.cos(angle);

  point.x -= pivot.x;
  point.y -= pivot.y;

  let xnew = point.x * c - point.y * s;
  let ynew = point.x * s + point.y * c;

  point.x = xnew + pivot.x;
  point.y = ynew + pivot.y;

  return point;
}

