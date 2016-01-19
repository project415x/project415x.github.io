/**
 * utils.js
 * This file includes all of the utilities needed for manipulating the coordinate system
 */

// For now these are fixed. It would be nice to make them able to be varied.
canvasScale = 25;
// halfCanvasHeight = 250;
// halfCanvasWidth = 250;

/**
* convertToMathCoords
* @description: Convert Screen Coordinates to Math Coordinates
* @param:
*   - x, y: Vector coordinates
*/
function convertToMathCoords(x, y) {
  // If anything goes wacko, this is supposed to be 250.
  halfCanvasHeight = 0.5 * paper.view.bounds.height;
  halfCanvasWidth = 0.5 * paper.view.bounds.width;
  
  var newX = (x - halfCanvasWidth) / canvasScale;
  var newY = -(y - halfCanvasHeight) / canvasScale;

  return [newX, newY];
}

/**
* convertToScreenCoords
* @description: Convert the Math Coordinates back to Screen Coordinates
* @param:
*   - x, y: Vector coordinates
*/
function convertToScreenCoords(x, y) {
  halfCanvasHeight = 0.5 * paper.view.bounds.height;
  halfCanvasWidth = 0.5 * paper.view.bounds.width;
  
  var newX = canvasScale * x + halfCanvasWidth;
  var newY = -canvasScale * y + halfCanvasHeight;

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
