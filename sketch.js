
// SKETCH

// Internal Source: AI Evolution
// Date: 2017-08-16


// Variables
var $vehicles = [],
    $food = [],
    $poison = [],
    $debug;

// Setup function
function setup() {

  createCanvas((window.innerWidth - 60), (window.innerHeight - 105));

  $debug = select('#debug');


  for (var i = 0; i < 10; i++) {
    var x = random(width),
        y = random(height);

    $vehicles[i] = new Vehicle(x, y);
  }

  // Generate food arrays
  for (var i = 0; i < 40; i++) {

    var x = random(width),
        y = random(height);

    $food.push(createVector(x, y));
  }

  for (var i = 0; i < 20; i++) {

    var x = random(width),
        y = random(height);

    $poison.push(createVector(x, y));
  }

}

// Draw function
function draw() {

  // Draw target

  if(random(1) < 0.1) {
    var x = random(width),
        y = random(height);

    $food.push(createVector(x, y));
  }

  if(random(1) < 0.01) {
    var x = random(width),
        y = random(height);

    $poison.push(createVector(x, y));
  }

  //var $target = createVector(mouseX, mouseY);

  background(51);
  fill(127);
  stroke(200);
  strokeWeight(2);

  //ellipse($target.x, $target.y, 48, 48);


  // Draw (good) food
  for(var i = 0; i < $food.length; i++) {
    fill(152, 191, 110);
    noStroke();
    ellipse($food[i].x, $food[i].y, 4, 4);
  }

  // Draw (bad) food
  for(var i = 0; i < $poison.length; i++) {
    fill(255, 84, 70);
    noStroke();
    ellipse($poison[i].x, $poison[i].y, 4, 4);
  }

  for (var i = $vehicles.length - 1; i >= 0; i--) {
    $vehicles[i].boundaries();
    $vehicles[i].behaviors($food, $poison);
    $vehicles[i].update();
    $vehicles[i].display();

    var $newVehicle = $vehicles[i].clone();

    if($newVehicle != null) {
      $vehicles.push($newVehicle);
    }

    if($vehicles[i].dead()) {

      var x = $vehicles[i].position.x,
          y = $vehicles[i].position.y;

      $food.push(createVector(x, y));

      $vehicles.splice(i, 1);
    }

  }

}
