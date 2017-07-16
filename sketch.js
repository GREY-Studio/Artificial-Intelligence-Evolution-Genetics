
// SKETCH

// Internal Source: AI Evolution
// Date: 2017-08-16


// Variables
var $vehicles = [],
    $food = [],
    $poison = [];

// Setup function
function setup() {

  createCanvas((window.innerWidth - 60), (window.innerHeight - 105));
  for (var i = 0; i < 10; i++) {
    var x = random(width),
        y = random(height);

    $vehicles[i] = new Vehicle(x, y);
  }

  // Generate food arrays
  for (var i = 0; i < 10; i++) {

    var x = random(width),
        y = random(height);

    $food.push(createVector(x, y));
  }

  for (var i = 0; i < 10; i++) {

    var x = random(width),
        y = random(height);

    $poison.push(createVector(x, y));
  }

}

// Draw function
function draw() {

  // Draw target

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
    ellipse($food[i].x, $food[i].y, 8, 8);
  }

  // Draw (bad) food
  for(var i = 0; i < $poison.length; i++) {
    fill(255, 84, 70);
    noStroke();
    ellipse($poison[i].x, $poison[i].y, 8, 8);
  }

  for (var i = 0; i < $vehicles.length; i++) {
    $vehicles[i].behaviors($food, $poison);
    $vehicles[i].update();
    $vehicles[i].display();
  }

}
