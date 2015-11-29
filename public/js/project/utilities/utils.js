/**
 * utils.js
 * This file includes all of the utilities needed for manipulating the coordinate system
 */

/**
* convertToMathCoords
* @description: Convert Screen Coordinates to Math Coordinates
* @param:
*   - x, y: Vector coordinates
*/
function convertToMathCoords(x, y) {
  var newX = (x - 250) / 25;
  var newY = -(y - 250) / 25;

  return [newX, newY];
}

/**
* convertToScreenCoords
* @description: Convert the Math Coordinates back to Screen Coordinates
* @param:
*   - x, y: Vector coordinates
*/
function convertToScreenCoords(x, y) {
  var newX = 25 * x + 250;
  var newY = -25 * y + 250;

  return [newX, newY];
}

/**
* applyMatrix
* @description: Apply the matrix transformation to the selected vector
* @param:
*   - x, y: Vector coordinates
*   - matrix: Tranformation matrix
*/
function applyMatrix(x, y, matrix) {
  var matrixApplied = [matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y];

  return matrixApplied;
}

/**
 * getRandomArbitrary
 * @description: Returns a random number between min (inclusive) and max (exclusive)
 * @param: min, max numbers in range
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * getRandomInt
 * @description: Returns a random integer between min (inclusive) and max (inclusive) Using Math.round() will give you a non-uniform distribution!
 * @param: min, max numbers in range
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* triggerMouseEvent
* @description: Faking a mouse event
*/
function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}
