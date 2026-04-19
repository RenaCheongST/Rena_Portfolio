/* DN1010 Experimental Interaction, Rena Cheong (G02) 2026
 * Week 4 - Generative Drawing
 * Boids
 * 
 * Added new code lines to change the colour from solid to rainbow, and changed the stroke to white for the aesthetic.
 * Changed the background to black to see the generated drawing with colours better.
 * Added an effect where the boids, when clicked with a mouse to follow, will bounce off each other.
 * 
 */

let flock;

function setup() {
  createCanvas(1000, 1000);

  background(0); // Changed background colour to black

  flock = new Flock();
  for (let i = 0; i < 100; i++) {
    let b = new Boid(random(width), random(height));
    flock.addBoid(b);
  }
}

function draw() {
  flock.run();
}

// Flock Object

function Flock() {
  this.boids = [];
}

Flock.prototype.run = function () {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);
  }
};

Flock.prototype.addBoid = function (b) {
  this.boids.push(b);
};

// Boid Class
function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 1.0;
  this.maxSpeed = 3;
  this.maxForce = 0.3;
}

Boid.prototype.run = function (boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
};

Boid.prototype.applyForce = function (force) {
  this.acceleration.add(force);
};

Boid.prototype.flock = function (boids) {
  let sep = this.separate(boids);
  let ali = this.align(boids);
  let coh = this.cohesion(boids);
  let fol = this.mouse(boids);

  sep.mult(1.0);
  ali.mult(1.0);
  coh.mult(1.0);
  fol.mult(0.4);

  if (key == "s") this.applyForce(sep);
  else if (key == "a") this.applyForce(ali);
  else if (key == "c") this.applyForce(coh);
  else;
  this.applyForce(fol);
};

Boid.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxSpeed);
  this.position.add(this.velocity);

  push();
  stroke(255, 255, 255); // White line colour
  strokeWeight(0.7); // Changed lineweight
  line(
    this.acceleration.x * 70 + this.position.x,
    this.acceleration.y * 70 + this.position.y,
    this.position.x,
    this.position.y
  );
  pop();

  // Reset accelertion to 0 each cycle.
  this.acceleration.mult(0);
};

// Calculates and applies a steering force towards a target.
Boid.prototype.seek = function (target) {
  let desired = p5.Vector.sub(target, this.position);

  desired.normalize();
  desired.mult(this.maxSpeed);

  let steer = p5.Vector.sub(desired, this.velocity);

  steer.limit(this.maxForce);
  return steer;
};

Boid.prototype.render = function () {
  let theta = this.velocity.heading() + PI / 2;
  fill(0);
  stroke(0);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  pop();

  for (let other of flock.boids) {
    let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);

    if (d < 60) {
      stroke(0, 30);
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
};

Boid.prototype.borders = function () {
  if (this.position.x < -this.r) this.position.x = width + this.r;
  if (this.position.y < -this.r) this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
};


// Rules of Flocking

Boid.prototype.separate = function (boids) {
  let desiredSeparation = 600;

  let steer = createVector(0, 0);
  let count = 0;

  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);

    if (d > 0 && d < desiredSeparation) {
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      steer.add(diff);
      count++;
    }
  }

  if (count > 0) {
    // Added rainbow colour to strokes
    let r = map(this.position.x, 0, width, 100, 255);
    let g = map(this.position.y, 0, height, 100, 255);
    let b = map(frameCount % 200, 0, 200, 100, 255);
    stroke(r, g, b, 120);
    strokeWeight(0.3);
    
    line(steer.x + this.position.x, steer.y + this.position.y, this.position.x, this.position.y);
    steer.div(count);
  }

  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxSpeed);
    steer.sub(this.velocity);
    steer.limit(this.maxForce);
  }

  return steer;
};

// Alignment
Boid.prototype.align = function (boids) {
  let neighbordist = 50;

  let sum = createVector(0, 0);
  let count = 0;

  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if (d > 0 && d < neighbordist) {
      sum.add(boids[i].velocity);
      count++;
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

// Cohesion
Boid.prototype.cohesion = function (boids) {
  let neighbordist = 50;

  let sum = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if (d > 0 && d < neighbordist) {
      sum.add(boids[i].position);
      count++;
    }
  }

  if (count > 0) {
    sum.div(count);
    return this.seek(sum);
  } else {
    return createVector(0, 0);
  }
};

// Follow Mouse
Boid.prototype.mouse = function (boids) {
  if (mouseIsPressed) return this.seek(createVector(mouseX, mouseY));
  else return createVector(0, 0);
};
