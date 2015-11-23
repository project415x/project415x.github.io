/**
 * utils.js
 * This file includes all of the utilities needed for manipulating the coordinate system
 */

/* I'm a bit unhappy that we're assuming once and for all that the canvases are 500 x 500.
 * It would be better to have a place where that number is hard-coded but could be changed.
 * I've started implementing that here but it's not finished. -Cary */

var halfCanvasWidth = 250;
// var gridLineLength = 25;
// var numberOfGridLines = 20;

/* In "Math coordinates" the origin is (0,0), the x-axis goes to the right, and the y-axis goes up.
 * In "Screen coordinates" the top-left of the screen is (0,0), the origin is (250,250), the x-direction
 * goes to the right, and the y-direction goes down. */

// Convert Screen Coordinates to Math Coordinates
function convertToMathCoords(x, y) {
  var newX = (x - 250) / 25;
  var newY = -(y - 250) / 25;

  return [newX, newY];
}

// Convert the Math Coordinates back to Screen Coordinates
function convertToScreenCoords(x, y) {
  var newX = 25 * x + 250;
  var newY = -25 * y + 250;

  return [newX, newY];
}

// Apply Matrix
function applyMatrix(x, y, matrix) {
  var matrixApplied = [matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y];

  return matrixApplied;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Drawing utilities
 
// A function that draws the grid. Right now it's only called with arguments 20, 20, paper.view.bounds
var drawGridLines = function(num_rectangles_wide, num_rectangles_tall, boundingRect) {
  var width_per_rectangle = boundingRect.width / num_rectangles_wide;
  var height_per_rectangle = boundingRect.height / num_rectangles_tall;
  for (var i = 0; i <= num_rectangles_wide; i++) {
    var xPos = boundingRect.left + i * width_per_rectangle;
    var topPoint = new paper.Point(xPos, boundingRect.top);
    var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
    var aLine = new paper.Path.Line(topPoint, bottomPoint);
    aLine.strokeColor = 'black';

    if (i == num_rectangles_wide / 2) {
      aLine.strokeWidth = 5;
    }
  }
  for (var i = 0; i <= num_rectangles_tall; i++) {
    var yPos = boundingRect.top + i * height_per_rectangle;
    var leftPoint = new paper.Point(boundingRect.left, yPos);
    var rightPoint = new paper.Point(boundingRect.right, yPos);
    var aLine = new paper.Path.Line(leftPoint, rightPoint);
    aLine.strokeColor = 'black';

    if (i == num_rectangles_tall / 2) {
      aLine.strokeWidth = 5;
    }
  }
}
