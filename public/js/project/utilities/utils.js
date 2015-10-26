/**
 * utils.js
 * This file includes all of the utilities needed for manipulating the coordinate system
 */

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
