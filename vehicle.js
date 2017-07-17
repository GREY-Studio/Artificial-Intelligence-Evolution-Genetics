
// VEHICLE

// Internal Source: AI Evolution
// https://github.com/GREY-Studio/Artificial-Intelligence-Evolution-Genetics
// Date: 2017-08-16


// Constructor vehicle
function Vehicle(x, y, dna) {

  // Variables & Settings (Physics)
  this.acceleration = createVector();
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.r = 3;
  this.maxspeed = 5;
  this.maxforce = 0.5;
  this.velocity.setMag(this.maxspeed);

  // DNA mutation controls
  if(dna instanceof Array) {

    // DNA
    this.dna = [];

    // Copy all the DNA
    for(var i = 0; i < dna.length; i++) {

      // 10% chance of DNA mutating
      if(random(1) < 0.1) {

        if(i < 2) {

          // Slight adjustment of steering force weights
          this.dna[i] = dna[i] + random(-0.2, 0.2);

        } else {

          // Adjust the perception radius (x100 scale)
          this.dna[i] = dna[i] + random(-10, 10);

        }

      // Copy DNA
      } else {

        this.dna[i] = dna[i];

      }

    }

  } else {

    var $maxf = 3;

    // DNA
    // 00: Attraction/Repulsion to food
    // 01: Attraction/Repulsion to poison
    // 02: Radius to sense food
    // 03: Radius to sense poison

    this.dna = [random(-$maxf, $maxf), random(-$maxf, $maxf), random(5, 100), random(5, 100)];

  }

  // Health
  this.health = 1;

}


// Method to update location
Vehicle.prototype.update = function() {

  // Update velocity
  this.velocity.add(this.acceleration);

  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);

  // Reset acceleration to 0 each cycle
  this.acceleration.mult(0);

  // Reduce health per frame
  this.health -= 0.005;

}

// Method declaring vehicle as dead
Vehicle.prototype.dead = function() {
  return (this.health < 0);
}

// Metod creating generations of a specific vehicle
Vehicle.prototype.birth = function() {

  if(random(1) < 0.001) {

    // Spawn new vehicle with same DNA as parent, same location
    return new Vehicle(this.position.x, this.position.y, this.dna);

  }

}

// Method that controlls eating habits
// 01. Check against array of food or poison
// 02. Index = 0 for food, Index = 1 for poison
Vehicle.prototype.eat = function(list, index) {

  // What is closest?
  var $closest = null,
      $closestD = Infinity;

  // Take a look at everything
  for(var i = list.length - 1; i >= 0; i--) {

    // Calculate distance
    var $distance = p5.Vector.dist(list[i], this.position);

    // If it's within perception radius and closer than pervious
    if($distance < this.dna[2 + index] && $distance < $closestD) {

      $closestD = $distance;

      // Save variable
      $closest = list[i];

      // If vehicle is within radius of 5px, eat it!
      if($distance < 5) {

        list.splice(i, 1);

        // Add or subtract from health based on kind of food
        this.health += $nutrition[index];

      }

    }

  }

  // If something was close
  if($closest) {

    // Seek
    var $seek = this.seek($closest, index);

    // Weight according to DNA
    $seek.mult(this.dna[index]);

    // Limit
    $seek.limit(this.maxforce);
    this.applyForce($seek);

  }

}

// Method that adds force to acceleration
Vehicle.prototype.applyForce = function(force) {

  this.acceleration.add(force);

}

// Method that calculates a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Vehicle.prototype.seek = function(target, index) {

  // A vector pointing from the location to the target
  var $desired = p5.Vector.sub(target, this.position),
      $d = $desired.mag();

  // Scale to maximum speed
  $desired.setMag(this.maxspeed);

  // Steering = Desired minus velocity
  var $steer = p5.Vector.sub($desired, this.velocity);

  //$steer.limit(this.maxforce);

  return $steer;

}

// Method that controll the graphical elements of vehicle
Vehicle.prototype.display = function() {

  // Color based on the health
  var $red = color(255, 84, 70),
      $green = color(152, 191, 110),
      $color = lerpColor($red, $green, this.health);


  // Draw a triangle rotated in the direction of velocity
  var $theta = this.velocity.heading() + PI / 2;

  push();

  translate(this.position.x, this.position.y);
  rotate($theta);

  // Debug tools
  if($debug.checked()) {

    noFill();

    // Ellipse and lines for food
    stroke($green);
    ellipse(0, 0, this.dna[2] * 2);
    line(0, 0, 0, -this.dna[0] * 25);

    // Ellipse and lines for poison
    stroke($red);
    ellipse(0, 0, this.dna[3] * 2);
    line(0, 0, 0, -this.dna[1] * 25);

  }

  // Draw the vehicle
  fill($color);
  stroke($color);

  beginShape();
  vertex(0, -this.r * 2);
  vertex(-this.r, this.r * 2);
  vertex(this.r, this.r * 2);
  endShape(CLOSE);

  pop();

}

// A force to keep vehicles on screen
Vehicle.prototype.boundaries = function() {

  var $distanceEdge = 10,
      $desired = null;

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
