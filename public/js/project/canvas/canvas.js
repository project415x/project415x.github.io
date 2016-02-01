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

      if (i === num_rectangles_tall / 2) {
        aLine.strokeWidth = 5;
      }
    }
  }

  function drawVector(vector) {
    vectorItem = new Group([
    new Path(
    [
      { x: 250, y: 250 }, 
      { x: vector[0], y: vector[1]}
    ]),

      // Arrows
      new Path([
        to + arrowVector.rotate(135),
        to,
        to + arrowVector.rotate(-135)
      ])
    ]);

    vectorItem.strokeColor = 'red';
    vectorItem.strokeWidth = 5;
    }

  /**
  * Figure out use case
  */
  function checkCollisions(oldVector,newVector,targets) {

  }

  function isClose(vector, target, radius) {
    
    var vectorX = vector.x,
        vectorY = vector.y,
        targetX = target.x,
        targetY = target.y;

    if (Math.abs(vectorX - targetX) <= radius && Math.abs(vectorY - targetY) <= radius) {
      return 1;
    }
    return 0;
  }
  
  /**
  *
  *
  */
  function proximity(outputVector, target) {


    if (isClose(targetX, targetY, 500)) {
      // console.log("Target proximity 500");
      target.updateColor('#e5e5ff');
    }

    else if (isClose(targetX, targetY, 450)) {
      // console.log("Target proximity 450");
      target.updateColor('#ccccff');
    }

    else if (isClose(targetX, targetY, 400)) {
      // console.log("Target proximity 400");
      target.updateColor('#b2b2ff');
    }

    else if (isClose(targetX, targetY, 350)) {
      // console.log("Target proximity 350");
      target.updateColor('#9999ff');
    }

    else if (isClose(targetX, targetY, 300)) {
      // console.log("Target proximity 300");
      target.updateColor('#7f7fff');
    }

    else if (isClose(targetX, targetY, 250)) {
      // console.log("Target proximity 250");
      target.updateColor('#6666ff');
    }

    else if (isClose(targetX, targetY, 200)) {
      // console.log("Target proximity 200");
      target.updateColor('#4c4cff');
    }

    else if (isClose(targetX, targetY, 150)) {
      // console.log("Target proximity 150");
      target.updateColor('#3232ff');
    }

    else if (isClose(targetX, targetY, 100)) {
      // console.log("Target proximity 100");
      target.updateColor('#1919ff');
    }

    else if (isClose(targetX, targetY, 50)) {
      // console.log("Target proximity 50");
      target.updateColor('#0000ff');
    }
  }

  /**
  * @PARAM target object as described in target.js
  * @RETURNS nothing
  */
  function drawTarget(target) {
    targetPath = new Path.Circle(new Point(target.x, target.y), 10);
    targetPath.fillColor = '#e5e5ff';
  }

  function drawTargets(targets) {
    // just a for loop with drawTarget
    for( var i = 0; i < targets.length; i++ ) {
      drawTarget(targets[i]);
    }
  }
} // end of constructor 