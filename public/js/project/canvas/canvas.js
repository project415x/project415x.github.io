/**
* CLASS CONSTRUCTOR
* @PARAM settings
  var settings = {
    minX: -10,
    minY: -10,
    maxX: 10,
    maxY: 10,
    pixelWidth: 500,
    pixelHeight: 500
  }
* USAGE: var left = canvas(settings);
*/
function canvas(settings) {
  
  //input error handling 
  this.minX = settings.minX || -10, 
  this.minY = settings.minY || -10, 
  this.maxX = settings.maxX || 10,
  this.maxY = settings.maxY || 10,
  this.pixelWidth = settings.pixelWidth || 500,
  this.pixelHeight = settings.pixelHeight || 500;

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
  * drawGridLines
  * @description: Provides the grid lines in the system
  */
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

  function drawVector(vector) {

  }

  function drawTarget(target) {

  }

  /**
  * 
  *
  */

  function checkCollisions(oldVector,newVector,targets) {

  }

  /**
  *
  *
  */

  function proximity(outputVector, target) {

  }


  /**
  *
  *
  */

  function drawTargets(targets) {
    // just a for loop with drawTarget
  }

}
