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

var Sauron = require('../sauron/sauron.js'),
    utils = require('../utilities/math.js');

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
                Sauron.tellSauron(d);
              })
              .on("drag", function(d) {
              var d = {
              // id: this.type+"-vector"
                  x: d3.event.x,
                  y: d3.event.y
                };
                // in theory this would be Vector.updateInputVector(d);
                Sauron.tellSauron(d);
              });

    return drag;
};

// returns DOM element associated to the canvas 
Canvas.prototype.getCanvas = function(type) {
  var id = type || this.type;
  return d3.select('#'+id+'-canvas');
};

Canvas.prototype.getSvg = function(type) {
  var id = type || this.type;
  return d3.select('#'+id+'-svg');
};

// returns svg def associated with the instance type
Canvas.prototype.getDefs = function(type) {
  var id = type || this.type;
  return d3.select('#'+id+'-defs');
};

Canvas.prototype.getTar = function() {
  return d3.select('#tar_img');
};

Canvas.prototype.appendSvg = function(type) {
  var id = type || this.type;
  var canvas = this.getCanvas(id).append('svg')
                .attr({
                       id: id+"-svg",
                       width: this.pixelWidth,
                       height: this.pixelHeight
                     });
};

Canvas.prototype.addImage = function() {
  var image = this.getImage();
  image.append('image')
       .attr({
         "x": "0",
         "y": "0",
         "width": "40",
         "height": "40",
         "xlink:href": "../public/img/target.gif"
       });
};

Canvas.prototype.appendImageToPattern = function() {
  var tar = this.getTar();
  tar.append('image')
   .attr({
     "x": "0",
     "y": "0",
     "width": "40",
     "height": "40",
     "xlink:href": "../public/img/target.gif"
   });
};

Canvas.prototype.appendPatternToDefs = function() {
  var defs = this.getDefs();
  defs.append('pattern')
            .attr({
              "id": "tar_img",
              "x": "0",
              "y": "0",
              "height": "40",
              "width": "40"
            });
};

Canvas.prototype.appendDefsToSvg = function(){
  var canvas = this.getSvg();
   canvas.append('defs')
      .attr("id", "output-defs");
};

Canvas.prototype.drawCanvas = function() {
  if(!this.type) {
    console.log('Invalid Canvas Type')
    return;
  }
  // append a svg to the canvas
  this.appendSvg();

  // add drag functionality to vector
  if(this.type === "input") {
    this.getCanvas().call(this.vectorDrag());
  }
  else if(this.type === "output") {
    this.drawTargetsOnCanvas();
  } 
};

Canvas.prototype.drawTargetsOnCanvas = function() {
  this.appendDefsToSvg();
  this.appendPatternToDefs();
  this.appendImageToPattern();
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
    if (utils.isClose(end_x,end_y,tar_x,tar_y,10)) {
      results[i] = true;
    }
    else {
      var param =(tar_x - start_x) * (end_x - start_x) + (tar_y - start_y) * (end_y - start_y);
      var temp = Math.pow((end_x - start_x),2) + Math.pow((end_y - start_y),2);
      param /= temp;
      var dis_x = start_x + param * (end_x - start_x);
      var dis_y = start_y + param * (end_y - start_y);
      //10 pixels is from Joseph's old settings
      if (utils.isClose(dis_x,dis_y,tar_x,tar_y,10)) {
        results[i] = true;
      }
      else {
        results[i] = false;
      }
    }
  }
  return results;
}

Canvas.prototype.proximity = function(outputVector, target) {
    if (utils.isClose(targetX, targetY, 500)) {
      target.updateColor('#e5e5ff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 450)) {
      target.updateColor('#ccccff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 400)) {
      target.updateColor('#b2b2ff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 350)) {
      target.updateColor('#9999ff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 300)) {
      target.updateColor('#7f7fff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 250)) {
      target.updateColor('#6666ff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 200)) {
      target.updateColor('#4c4cff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 150)) {
      target.updateColor('#3232ff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 100)) {
      target.updateColor('#1919ff', target.id);
    }
    else if (utils.isClose(targetX, targetY, 50)) {
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

Canvas.prototype.checkProximity = function(vector, target) {
  return utils.isClose(vector.head.x, vector.head.y, target.x, target.y, target.r);
}

module.exports = Canvas;