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
  this.pixelHeight = settings.pixelHeight || 500,
  this.Origin = [x: 0.5 * this.pixelWidth, y: 0.5 * this.pixelHeight] || [x: 250, y: 250];


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
  function drawGridLines(num_rectangles_wide, num_rectangles_tall, boundingRect) {
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
    if (vector.drawingObject){
      vector.drawingObject.remove();
    }

    var end = [x: vector.x, y: vector.y];
    var arrowVectorTemp = end - this.Origin;
    //Change the param of normalize() based on settings (maybe vetor.?);
    var arrowVector = arrowVectorTemp.normalize(10);

    vector.drawingObject = new Group([
      new Path([this.Origin, end]),
      // This is for the arrow
      new Path([
        end + arrowVector.rotate(135),
        end,
        end + arrowVector.rotate(-135)
      ])
    ]);
    //Change the params based on settings (maybe vetor.?);
    vector.drawingObject.strokeWidth = 5;
    vector.drawingObject.strokeColor = '#e4141b';
  }

  /**
  *
  *
  */
  function checkCollisions(oldVector,newVector,targets) {
    var start_x = oldVector.x,
        start_y = oldVector.y,
        end_x = newVector.x,
        end_y = newVector.y,
        results = [];
    for (i = 0; i < targets.length; i++) {
      var tar_x = targets[i].x,
          tar_y = targets[i].y;
      //10 pixels is from Joseph's old settings
      if (isClose(end_x,end_y,tar_x,tar_y,10)) {
        results[i] = true;
      }
      else {
        var param =(tar_x - start_x) * (end_x - start_x) + (tar_y - start_y) * (end_y - start_y);
        var temp = Math.pow((end_x - start_x),2) + Math.pow((end_y - start_y),2);
        param /= temp;
        var dis_x = start_x + param * (end_x - start_x);
        var dis_y = start_y + param * (end_y - start_y;
        //10 pixels is from Joseph's old settings
        if (isClose(dis_x,dis_y,tar_x,tar_y,10)) {
          results[i] = true;
        }
        else {
          results[i] = false;
        }
      }
    }
    return results;
  }


  function isClose(oX, oY, tX, tY, radius) {
    var dis = Math.sqrt(Math.pow((tX - oX),2) + Math.pow((tY - oY),2));
    if (dis <= radius) {
      return true;
    }
    return false;
  }

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
