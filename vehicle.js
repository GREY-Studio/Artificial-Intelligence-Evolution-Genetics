
// VEHICLE

// Internal Source: AI Evolution
// Date: 2017-08-16


function Vehicle(x, y) {

  // Variables & Settings
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 4;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  // Health
  this.health = 1;

  // DNA
  this.dna = [];
  // Food weight
  this.dna[0] = random(-2, 2);
  // Poison weight
  this.dna[1] = random(-2, 2);
  // Food perception
  this.dna[2] = random(0, 100);
  // Poison perception
  this.dna[3] = random(0, 100);

  // Method to update location
  this.update = function() {

    this.health -= 0.01;

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

    var $steerG = this.eat(good, 0.2, this.dna[2]),
        $steerB = this.eat(bad, -0.5, this.dna[3]);

    $steerG.mult(this.dna[0]);
    $steerB.mult(this.dna[1]);

    this.applyForce($steerG);
    this.applyForce($steerB);

  }

  // Method that controll eating
  this.eat = function(list, nutrition, perception) {

    var $record = Infinity,
        $closest = -1;

    for(var i = 0; i < list.length; i++) {

      var $distance = this.position.dist(list[i]);

      if($distance < $record && $distance < perception) {
        $record = $distance;
        $closest = i;
      }

    }

    if($record < 5) {
      list.splice($closest, 1);
      this.health += nutrition;
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

  // Method declaring vehicle as dead
  this.dead = function() {
    return (this.health < 0);
  }

  // Graphical elements
  this.display = function() {

    // Draw a triangle rotated in the direction of velocity
    var $angle = this.velocity.heading() + PI / 2;

    push();

    translate(this.position.x, this.position.y);
    rotate($angle);

    stroke(152, 191, 110);
    noFill();
    line(0, 0, 0, -this.dna[0] * 20);
    ellipse(0, 0, this.dna[2] * 2);
    stroke(255, 84, 70);
    line(0, 0, 0, -this.dna[1] * 20);
    ellipse(0, 0, this.dna[3] * 2);


    var $red = color(255, 84, 70),
        $green = color(152, 191, 110),
        $color = lerpColor($red, $green, this.health);

    // Geometry
    fill($color);
    stroke($color);
    strokeWeight(2);

    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();

  }

  // A force to keep vehicles on screen
  this.boundaries = function() {

    var $distanceEdge = 10;
    var $desired = null;

    if (this.position.x < $distanceEdge) {
      $desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - $distanceEdge) {
      $desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < $distanceEdge) {
      $desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - $distanceEdge) {
      $desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if ($desired !== null) {
      $desired.setMag(this.maxspeed);
      var $steer = p5.Vector.sub($desired, this.velocity);
      $steer.limit(this.maxforce);
      this.applyForce($steer);
    }
  }

}
