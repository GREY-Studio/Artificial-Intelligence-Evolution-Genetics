
// VEHICLE

// Internal Source: AI Evolution
// Date: 2017-08-16


function Vehicle(x, y) {

  // Variables & Settings
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 6;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  // Health
  this.health = 1;

  // DNA
  this.dna = [];
  this.dna[0] = random(-5, 5);
  this.dna[1] = random(-5, 5);

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

  // Method declaring behaviors
  this.behaviors = function(good, bad) {

    var $steerG = this.eat(good),
        $steerB = this.eat(bad);

    $steerG.mult(this.dna[0]);
    $steerB.mult(this.dna[1]);

    this.applyForce($steerG);
    this.applyForce($steerB);

  }

  // Method that controll eating
  this.eat = function(list) {

    var $record = Infinity,
        $closest = -1;

    for(var i = 0; i < list.length; i++) {

      var $distance = this.position.dist(list[i]);

      if($distance < $record) {
        $record = $distance;
        $closest = i;
      }

    }

    if($record < 5) {
      list.splice($closest, 1);
    } else if($closest > -1) {
      return this.seek(list[$closest]);
    }

    return createVector(0, 0);

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

    //this.applyForce($steer);

    return $steer;

  }

  // Graphical elements
  this.display = function() {

    // Draw a triangle rotated in the direction of velocity
    var $angle = this.velocity.heading() + PI / 2;

    push();

    translate(this.position.x, this.position.y);
    rotate($angle);

    stroke(152, 191, 110);
    line(0, 0, 0, -this.dna[0] * 20);
    stroke(255, 84, 70);
    line(0, 0, 0, -this.dna[1] * 20);

    // Geometry
    fill(127);
    stroke(200);
    strokeWeight(2);

    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();

  }

}
