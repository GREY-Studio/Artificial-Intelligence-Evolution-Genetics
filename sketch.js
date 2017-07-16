
// SKETCH

// Internal Source: AI Evolution
// Date: 2017-08-16


// Variables
var $vehicle,
    $food = [];

// Setup function
function setup() {

  createCanvas((window.innerWidth - 60), (window.innerHeight - 105));


  $vehicle = new Vehicle(width/2, height/2);


}

// Draw function
function draw() {

  var $target = createVector(mouseX, mouseY);

  background(51);
  fill(127);
  stroke(200);
  strokeWeight(2);

  ellipse($target.x, $target.y, 48, 48);

  $vehicle.seek($target);
  $vehicle.update();
  $vehicle.display();

}
