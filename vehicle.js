
// VEHICLE

// Internal Source: AI Evolution
// Date: 2017-08-16


function Vehicle(x, y) {

  // Variables & Settings
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 6;
  this.maxspeed = 8;
  this.maxforce = 0.2;

  // Method to update location
  this.update = function() {

    // Update velocity
    this.velocity.add(this.acceleration);

    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);

    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);

  }

  // Method to apply force
  this.applyForce = function(force) {

    // Add mass?
    this.acceleration.add(force);

  }

  // Method that calculates a steering force
  // 'Steer' = 'Decired minus velocity'
  this.seek = function(target) {

    var $desired = p5.Vector.sub(target, this.position);

    // Scale to maximum speed
    $desired.setMag(this.maxspeed);

    // Steering = desired minus velocity
    var $steer = p5.Vector.sub($desired, this.velocity);

    // Limit to maxspeed
    $steer.limit(this.maxforce);

    this.applyForce($steer);

  }

  // Graphical elements
  this.display = function() {

    // Draw a triangle rotated in the direction of velocity
    var $theta = this.velocity.heading() + PI / 2;

    push();

    translate(this.position.x, this.position.y);
    rotate($theta);

    // Geometry
    fill(127);
    stroke(200);

    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();

  }

}
