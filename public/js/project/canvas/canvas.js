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
* USAGE: var inputCanvas = Canvas(inputCanvasSettings);
*/
function Canvas(settings) {
  //input error handling
  this.minX = settings.minX || -10,
  this.minY = settings.minY || -10,
  this.maxX = settings.maxX || 10,
  this.maxY = settings.maxY || 10,
  this.pixelWidth = settings.pixelWidth || 500,
  this.pixelHeight = settings.pixelHeight || 500,
  this.originX = (0.5 * this.pixelWidth) || 250,
  this.originY = (0.5 * this.pixelHeight) || 250,
  this.origin = {
    x: this.originX,
    y: this.originY
  };
  this.type = settings.type || "not a valid type";
} // end of constructor

 /**
  * convertToScreenCoords
  * @description: Convert the Math Coordinates back to Screen Coordinates
  * @param:
  *   - x, y: Vector coordinates
  */
  Canvas.prototype.convertToScreenCoords = function(x,y) {
    /*
    var halfCanvasHeight = this.height * 0.5,
        halfCanvasWidth = this.width * 0.5;
    */
    halfCanvasHeight = 0.5 * paper.view.bounds.height;
    halfCanvasWidth = 0.5 * paper.view.bounds.width;

    // what is canvas scale... 
    // ahhh global variables galore!
    var newX = canvasScale * x + halfCanvasWidth;
    var newY = -canvasScale * y + halfCanvasHeight;

    return [newX, newY];
  }

  Canvas.prototype.drawCanvas = function() {
    if(this.type) {
      d3.select('#'+this.type+'-canvas').append('svg')
      .attr({
        id: this.type+"-svg",
        width: this.pixelWidth,
        height: this.pixelHeight
      })
      .on("click", function(d, i) {
        console.log('d3 event', d3.event)
      });
    }
    else {
      console.log("Invalid canvas type: ",this.type)
    }
  };

  /**
  * drawGridLines
  * @description: Provides the grid lines in the system
  *  DON'T THINK WE NEED THIS
  */
  Canvas.prototype.drawGridLines = function(num_rectangles_wide, num_rectangles_tall, boundingRect) {
    var width_per_rectangle = boundingRect.width / num_rectangles_wide;
    var height_per_rectangle = boundingRect.height / num_rectangles_tall;
    for (var i = 0; i <= num_rectangles_wide; i++) {
      /*
      var xPos = boundingRect.left + i * width_per_rectangle;
      var topPoint = new paper.Point(xPos, boundingRect.top);
      var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
      var aLine = new paper.Path.Line(topPoint, bottomPoint);
      aLine.strokeColor = 'black';
      */

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


  Canvas.prototype.drawVector = function(vector) {

    var end = {
      x: vector.x,
      y: vector.y
    };

    var arrowVectorTemp = {
      x: end.x - this.origin.x,
      y: end.y - this.origin.y
    };

    //Change the param of normalize() based on settings (maybe vetor.?);
    // TODO NORMALIZE THE VECTOR
    var arrowVector = arrowVectorTemp.normalize(10);

    // PAPERSCRIPT OR WEBGL
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
  Canvas.prototype.checkCollisions = function(oldVector,newVector,targets) {
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
        var dis_y = start_y + param * (end_y - start_y);
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


Canvas.prototype.isClose = function(oX, oY, tX, tY, radius) {
  var dist = Math.sqrt(Math.pow((tX - oX),2) + Math.pow((tY - oY),2));
  if (dist <= radius) {
    return true;
  }
  return false;
}

Canvas.prototype.proximity = function(outputVector, target) {
    if (isClose(targetX, targetY, 500)) {
      target.updateColor('#e5e5ff', target.id);
    }
    else if (isClose(targetX, targetY, 450)) {
      target.updateColor('#ccccff', target.id);
    }
    else if (isClose(targetX, targetY, 400)) {
      target.updateColor('#b2b2ff', target.id);
    }
    else if (isClose(targetX, targetY, 350)) {
      target.updateColor('#9999ff', target.id);
    }
    else if (isClose(targetX, targetY, 300)) {
      target.updateColor('#7f7fff', target.id);
    }
    else if (isClose(targetX, targetY, 250)) {
      target.updateColor('#6666ff', target.id);
    }
    else if (isClose(targetX, targetY, 200)) {
      target.updateColor('#4c4cff', target.id);
    }
    else if (isClose(targetX, targetY, 150)) {
      target.updateColor('#3232ff', target.id);
    }
    else if (isClose(targetX, targetY, 100)) {
      target.updateColor('#1919ff', target.id);
    }
    else if (isClose(targetX, targetY, 50)) {
      target.updateColor('#0000ff', target.id);
    }
  }

  /**
  * @PARAM target object as described in target.js
  * @RETURNS nothing
  */
  Canvas.prototype.drawTarget = function(target) {
    // grab svg container
    d3.select('#'+this.type+'-canvas').append("circle")
      .attr({
        cx: target.x,
        cy: target.y,
        r: target.r,
        color: target.color
      });
  };

  Canvas.prototype.drawTargets = function(targets) {
    // just a for loop with drawTarget
    for( var i = 0; i < targets.length; i++ ) {
      drawTarget(targets[i]);
    }
  };
