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
// import vector.js
// var vector = require('../actors/vector.js');
function Canvas(settings) {
  //input error handling
  this.minX = settings.minX || -10,
  this.minY = settings.minY || -10,
  this.maxX = settings.maxX || 10,
  this.maxY = settings.maxY || 10,
  this.pixelWidth = settings.pixelWidth || 500,
  this.pixelHeight = settings.pixelHeight || 500,
  this.originX = ( this.pixelWidth * (-this.minX)/(this.maxX - this.minX)) || 250,
  this.originY = ( this.pixelHeight * (-this.minY)/(this.maxY - this.minY)) || 250,
  this.origin = {
    x: this.originX,
    y: this.originY
  },
  this.type = settings.type || "not a valid type";
}

Canvas.prototype.vectorDrag = function() {
  var drag = d3.behavior.drag()
              .on("dragstart", function (){
                var d = {
              // id: this.type+"-vector"
                  x: d3.event.sourceEvent.x,
                  y: d3.event.sourceEvent.y
                };
                // in theory this would be Vector.updateInputVector(d);
                updateInputVector(d);
                updateOutputVector(d);
                updateTargets(d);
              })
              .on("drag", function(d) {
              var d = {
              // id: this.type+"-vector"
                  x: d3.event.x,
                  y: d3.event.y
                };
                // in theory this would be Vector.updateInputVector(d);
                updateInputVector(d);
                updateOutputVector(d);
                updateTargets(d);
              });

    return drag;
};

Canvas.prototype.drawCanvas = function() {
  if(this.type) {
      var canvas = d3.select('#'+this.type+'-canvas').append('svg')
                     .attr({
                       id: this.type+"-svg",
                       width: this.pixelWidth,
                       height: this.pixelHeight
                     });
      if(this.type === "input")
        canvas.call(this.vectorDrag());

      if(this.type === "output") {
        // Define defs to store target image pattern
        // Maybe figure out a better place for this code later
        var defs = d3.select('#'+this.type+'-svg').append('defs')
                                  .attr("id", "canvas-defs");
        defs.append('pattern')
            .attr({
              "id": "tar_img",
              "x": "0",
              "y": "0",
              "height": "40",
              "width": "40"
            });
        d3.select('#tar_img').append('image')
                             .attr({
                               "x": "0",
                               "y": "0",
                               "width": "40",
                               "height": "40",
                               "xlink:href": "../public/img/target.gif"
                             });
      }
      // remove this and notify eye of sauron instead
      // updateLog(d) as example
  }
  else {
    console.log("Invalid canvas type: ",this.type)
  }
};


Canvas.prototype.drawProgressBar = function() {
  var container = d3.select('#progress-container');
      container.append('div')
                .attr({
                  "class": "progress-bar progress-bar-striped active",
                  "role": "progressbar",
                  "aria-valuenow": "0",
                  "aria-valuemin": "0",
                  "aria-valuemax": "100",
                  //"style": "width: 0%",
                  "id" : "progressbar"
                });
      container.append('span')
         .attr("id", "score")
         .text("0% Complete");
}

function updateInputVector(d){
// redraw input vector
  d3.select('#input-vector').remove();
  d3.select('#input-svg').append('path')
    .attr({
      "stroke": "red",
      "stroke-width":"4",
      "d": "M 250 250 L"+d.x+" "+d.y+"z",
      "id": 'input-vector'
  });
};

function updateOutputVector(d) {
  var i = applyMatrix(d.x,d.y);
  d3.select('#output-vector').remove();
  d3.select('#output-svg').append('path')
    .attr({
      "stroke": "red",
      "stroke-width":"4",
      //"fill": "/path/to/here",
      "d": "M 250 250 L"+i[0]+" "+i[1]+"z",
      "id": 'output-vector'
  });
};

function updateTargets(d) {
  var x = d3.selectAll("circle").attr("cx"),
      y = d3.selectAll("circle").attr("cy"),
      r = d3.selectAll("circle").attr("r"),
      i = applyMatrix(d.x,d.y);
  if (isClose(i[0],i[1],x,y,r)) {
    d3.selectAll("circle").remove();
    updateProgress();
    generateTarget([[1,3],[2,0]]);
  }
}

function updateProgress() {
    var bar = d3.select('#progressbar'),
        score = d3.select('#score');
        curr = bar.attr("aria-valuenow");
        if (Number(curr) >= 100) {
          curr = 100;
          score.text("Proceed To Next Level!");
        }
        else {
          curr = Number(curr) + 5;
          score.text(curr + "% Complete");
        }

        bar.style("width", curr + "%");
        bar.attr("aria-valuenow", curr);
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


function isClose(oX, oY, tX, tY, radius) {
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

Canvas.prototype.checkProximity = function(vector, target) {
  return this.isClose(vector.head.x, vector.head.y, target.x, target.y, target.r);
}

function screenToMath(x,y) {
  return [(x - 250) * 10 / 250, - (y - 250) * 10 / 250];
}

function mathToScreen(x,y) {
  return [x * 250 / 10 + 250, - y * 250 / 10 + 250];
}

function applyMatrix(sX,sY,matrix) {
  var matrix = matrix || [[1,3],[2,0]];
  var math_coord = screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return mathToScreen(applied_coord[0],applied_coord[1]);
}

function getRandom(min,max) {
  return Math.random() * (max - min) + min;
}

function generateTarget(matrix) {
  var legal = false,
      par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  var newX, newY;

  while (!legal) {
    newX = getRandom(0,500);
    newY = getRandom(0,500);
    var pre = screenToMath(newX,newY);
    var prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / par,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / par;
    pre = mathToScreen(prex,prey);

    if (pre[0] >= 0 && pre[0] <= 500 && pre[1] >= 0 && pre[1] <= 500) {
      legal = true;
      var targetSettings = {
      	x: newX,
      	y: newY,
      	r: 20,
      	color: "black",
      	isScore: false
      };
      var newTarget = new Target(targetSettings);
      newTarget.drawTarget();
    }
  }

}
