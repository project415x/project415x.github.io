/**
 * Output Canvas
 * This is where the output vector is being generated and shown in the DOM
 * All variables and functions not defined here are in the following two files:
 * _includes/transformation.html
 * public/js/project/utilities/utils.js
 */

// Draw the grid. This function is in utils.js
drawGridLines(20, 20, paper.view.bounds);

/* Target */
var targetX = getRandomInt(10, 490);
var targetY = getRandomInt(10, 490);
var targetPath = new Path.Circle(new Point(targetX, targetY), 10);
targetPath.fillColor = '#e5e5ff';
var score = 0;

// A variable that holds the vector drawn in the output canvas.
var vectorItem;

// Called whenever the mouse is pressed down while hovering over the output canvas.
// This was originally being called from transformation.html whenever the mouse was released from the input canvas.
// Now we're changing it so that this is always called.
// Note that the 'event' argument is not used.
//function onMouseDown(event) {
function outputCanvasTick() {
	
	var pscope2 = PaperScope.get(2)
	pscope2.activate()

  // A function to check proximity of target.
  function isClose(radius) {
    if(Math.abs(targetX - screenCoords[0]) <= radius && Math.abs(targetY - screenCoords[1]) <= radius) {
      return 1;
    }
    return 0;
  }

  // 'input' is a global variable defined in transformation.html.
  //console.log(input);

  /* New Formula. Same great taste! */
  
  /* These functions are located in utils.js:
   * convertToMathCoords, applyMatrix, convertToScreenCoords
   * The variable 'matrix' is located in transformation.html: matrix */
  var mathCoords = convertToMathCoords(halfCanvasWidth + input.x, halfCanvasWidth + input.y);
  var matrixApplied = applyMatrix(mathCoords[0], mathCoords[1], matrix);
  var screenCoords = convertToScreenCoords(matrixApplied[0], matrixApplied[1]);
  to = new Point(screenCoords[0], screenCoords[1]);
  
  // The vector to be drawn has tail at the center of the output pane.
  fro = new Point(halfCanvasWidth, halfCanvasWidth);

  straightLine = to - fro;

  var arrowVector = straightLine.normalize(10);

  if (vectorItem)
    vectorItem.remove();

  // Draw New Vector
  vectorItem = new Group([
    new Path([{
      x: halfCanvasWidth,
      y: halfCanvasWidth
    }, {
      x: screenCoords[0],
      y: screenCoords[1]
    }]),

    // Arrows
    new Path([
      to + arrowVector.rotate(135),
      to,
      to + arrowVector.rotate(-135)
    ])
  ]);

  vectorItem.strokeColor = 'red';
  vectorItem.strokeWidth = 5;

  /* Proximity Sensor */
  // #e5e5ff, #ccccff, #b2b2ff, #9999ff, #7f7fff, #6666ff, #4c4cff, #3232ff, #1919ff, #0000ff
  if(isClose(500)) {
    console.log("Target proximity 500");
    targetPath.fillColor = '#e5e5ff';
  }

  if(isClose(450)) {
    console.log("Target proximity 450");
    targetPath.fillColor = '#ccccff';
  }

  if(isClose(400)) {
    console.log("Target proximity 400");
    targetPath.fillColor = '#b2b2ff';
  }

  if(isClose(350)) {
    console.log("Target proximity 350");
    targetPath.fillColor = '#9999ff';
  }

  if(isClose(300)) {
    console.log("Target proximity 300");
    targetPath.fillColor = '#7f7fff';
  }

  if(isClose(250)) {
    console.log("Target proximity 250");
    targetPath.fillColor = '#6666ff';
  }

  if(isClose(200)) {
    console.log("Target proximity 200");
    targetPath.fillColor = '#4c4cff';
  }

  if(isClose(150)) {
    console.log("Target proximity 150");
    targetPath.fillColor = '#3232ff';
  }

  if(isClose(100)) {
    console.log("Target proximity 100");
    targetPath.fillColor = '#1919ff';
  }

  if(isClose(50)) {
    console.log("Target proximity 50");
    targetPath.fillColor = '#0000ff';
  }

  /* If target is hit */
  if(isClose(10)) {
    // Hide the target that was hit
    targetPath.visible = false;
    console.log("Target was hit!");

    // Create the score circle
    scoreX = 460;
    scoreY = 40;
    var scorePath = new Path.Circle(new Point(scoreX, scoreY), 30);
    scorePath.fillColor = '#7CFC00';
    // scorePath.opacity = 0.75;

    // Change the score text
    score += 10;
    var text = new PointText(new Point(scoreX, scoreY + 7));
    text.justification = 'center';
    text.fillColor = 'black';
    text.content = score;
    text.fontSize = 20;

    // Create a new random target
    targetX = getRandomInt(10, 460);
    targetY = getRandomInt(10, 460);
    targetPath = new Path.Circle(new Point(targetX, targetY), 10);
    targetPath.fillColor = '#e5e5ff';
  }

  //console.log(straightLine);
  
  pscope2.view.update()
}

// Basic game loop. Calls the function outputCanvasTick every 33ms.
setInterval(outputCanvasTick, 33);
