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