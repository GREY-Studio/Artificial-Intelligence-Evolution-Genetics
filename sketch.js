
// SKETCH

// Internal Source: AI Evolution
// https://github.com/GREY-Studio/Artificial-Intelligence-Evolution-Genetics
// Date: 2017-08-16


// Variables
// 01. An array of vehicles
// 02. An array of "food"
// 03. An array of "poison"
// 04. How good is food, how bad is poison?
// 05. Show additional info on DNA, Debugging tools
var $population = [],
    $food = [],
    $poison = [],
    $nutrition = [0.3, -1],
    $debug;

// Setup function
function setup() {

  // Create canvas
  var $canvas = createCanvas((window.innerWidth - 60), (window.innerHeight - 105));
  $canvas.parent('canvas-container');

  // Select debug tools
  $debug = select('#debug');

  // Create a number of (10) vehicles
  angleMode(RADIANS);

  for(var i = 0; i < 10; i++) {
    $population[i] = new Vehicle(width / 2, height / 2);
  }

  // Start with some food
  for(var i = 0; i < 70; i++) {
    $food[i] = createVector(random(width), random(height));
  }

  // Start with some poison
  for(var i = 0; i < 40; i++) {
    $poison[i] = createVector(random(width), random(height));
  }

}

// Add new vehicles by dragging mouse
//function mouseDragged() {
//  population.push(new Vehicle(mouseX, mouseY));
//}

// Draw function
function draw() {

  background(51);

  // (10%) Chance of new food
  if(random(1) < 0.1) {

    $food.push(createVector(random(width), random(height)));

  }

  // (1%) Chance of new poison
  if(random(1) < 0.01) {

    $poison.push(createVector(random(width), random(height)));

  }

  // Go through all of the vehicles
  for(var i = $population.length - 1; i >= 0; i--) {

    var $v = $population[i];

    // Eat the food (index 0)
    $v.eat($food, 0);

    // Eat the poison (index 1)
    $v.eat($poison, 1);

    // Check boundaries
    $v.boundaries();

    // Update and draw
    $v.update();
    $v.display();

    // If the vehicle has died, remove
    if($v.dead()) {

      $food.push(createVector($v.position.x, $v.position.y));
      $population.splice(i, 1);

    } else {

      // Every vehicle has a chance of cloning itself
      var $child = $v.birth();

      if ($child != null) {

        $population.push($child);

      }

    }

  }

  // Draw all the food and all the poison
  for(var i = 0; i < $food.length; i++) {

    fill(152, 191, 110);
    noStroke();
    ellipse($food[i].x, $food[i].y, 4);

  }

  for(var i = 0; i < $poison.length; i++) {

    fill(255, 84, 70);
    noStroke();
    ellipse($poison[i].x, $poison[i].y, 4);

  }

}
