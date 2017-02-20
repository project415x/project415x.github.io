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

/* This file has the canvas class. In principle, the canvas class will only know its dimensions,
 * where the math grid lies along it, and which HTML element is associated to it. It doesn't know
 * any game logic. The member variable "type" tells which HTML element the canvas is associated to.
 * For instance if type="input" then the element has ID #input-canvas. The functions in this class
 * append svg tags inside the parent div tag, to draw things to the canvas.
 *
 * (Any code that doesn't do this should be moved to another file!)
 *
 * Cary
 */
var Sauron = require('../sauron/sauron.js'),
    OverWatcher = new Sauron({}),
    Tutorial = require('../tutorial/tutorial.js'),
    utils = require('../utilities/math.js');

function Canvas(settings) {
  console.log("hello canvas");
  //input error handling

  // console.log(document.body.offsetWidth/2.5 + "   " + document.body.offsetHeight/1.5);

  var w = Math.min(document.body.offsetWidth/2.50, window.outerHeight/1.8);
  this.minX = settings.minX || -10,
  this.minY = settings.minY || -10,
  this.maxX = settings.maxX || 10,
  this.maxY = settings.maxY || 10,
  this.pixelWidth = w,
  this.pixelHeight = w,
  this.originX = w/2,
  this.originY = w/2,
  this.origin = {
    x: this.originX,
    y: this.originY
  },
  this.type = settings.type || "not a valid type",
  this.timer = settings.timer || this.getTimer();

}

// Return modified d3 drag listener
// using this inside of return statement refers to d3, not Canvas
// so, self = this is used to differentiate between canvas object and d3 object.
Canvas.prototype.vectorDrag = function() {
  self = this;
  return d3.behavior.drag()
              .on("dragstart", function (){
                OverWatcher.tellSauron(d3.mouse(this), "drag");
                //Tutorial.tutorialControl(2,500);
                // If you want the single click instead of double, replace the
                //  next four lines until but not including '})' with
                //  OverWatcher.tellSauron(d3.mouse(this), "dbclick");
                var newTimer = self.getTimer();
                if (newTimer - self.timer <= 200) {
                  OverWatcher.tellSauron(d3.mouse(this), "dbclick");
                }
                self.timer = newTimer;
              })
              .on("drag", function() {
                OverWatcher.tellSauron(d3.mouse(this), "drag");
                //Tutorial.tutorialControl(3,500);
              });
};

// returns div DOM element associated to the canvas
Canvas.prototype.getCanvas = function(type) {
  var id = type || this.type;
  return d3.select('#'+id+'-canvas');
};

// returns SVG DOM element associated with
Canvas.prototype.getSvg = function(type) {
  var id = type || this.type;
  return d3.select('#'+id+'-svg');
};

// returns svg def associated with the instance type
// not quite sure what a def is...
// let's ask Z because he wrote the code to generate the oil cans
Canvas.prototype.getDefs = function(type) {
  var id = type || this.type;
  return d3.select('#'+id+'-defs');
};

// See Z on purpose of tar_img
Canvas.prototype.getTar = function(id) {
  return d3.select('#tar' + id);
};

// Appends SVG DOM element to a div.
Canvas.prototype.appendSvg = function(type) {
  var id = type || this.type;
  var canvas = this.getCanvas(id).append('svg')
                .attr({
                       id: id+"-svg",
                       width: this.pixelWidth,
                       height: this.pixelHeight
                     });
};

// Adds image on top of Circle (Target).
// To randomize targets write function to randomly grab a .gif from ../img/*
Canvas.prototype.appendImageToPattern = function() {
  if (this.type === "output") {
    for(i = 1; i < 20; i++) {
      var tar = this.getTar(i);
      tar.append('image')
               .attr({
                 "x": "0",
                 "y": "0",
                 "width": "40",
                 "height": "40",
                 "xlink:href": "../img/items/glow/target" + i + ".gif"
               });
    }
    var arm = this.getTar("arm");
    arm.append('image')
             .attr({
               "x": "0",
               "y": "0",
               "width": "30px",
               "height": "100px",
               "xlink:href": "../img/robotarm.gif"
             });
    for(i = 2; i<=4; i++){
      var robo = this.getTar("roboglitch"+i);
      robo.append('image')
               .attr({
                 "x": "0",
                 "y": "0",
                 "width": "92px",
                 "height": "109px",
                 "xlink:href": "../img/robo/roboglitch"+i+".gif"
               });
    }
    for(i = 1; i < 5; i++){
      var robo = this.getTar("robo"+i);
      robo.append('image')
               .attr({
                 "x": "0",
                 "y": "0",
                 "width": "69px",
                 "height": "94px",
                 "xlink:href": "../img/robo/robo"+i+".gif"
               });
    }
  }
  if (this.type === "input") {
    var blip = this.getTar("blip");
    blip.append('image')
              .attr({
                "x": "0",
                "y": "0",
                "width": "40",
                "height": "40",
                "xlink:href": "../img/blip.gif"
              });
  }
};

// grabs def elemetn and appends a pattern on it to prep us to add imag
Canvas.prototype.appendPatternToDefs = function() {
  var defs = this.getDefs();
  if (this.type === "output") {
    for(i = 1; i < 20; i++) {
      defs.append('pattern')
                .attr({
                  "id": "tar" + i,
                  "x": "0",
                  "y": "0",
                  "height": "40",
                  "width": "40"
                });
    }
    defs.append('pattern')
              .attr({
                "id": "tararm",
                "x": "0",
                "y": "0",
                "height": "100px",
                "width": "30px"
              });
    for(i = 2; i<=4; i++){
      defs.append('pattern')
                  .attr({
                    "id": "tarroboglitch"+i,
                    "x": "0",
                    "y": "0",
                    "height": "1",
                    "width": "1"
                  });
    }
    for(i = 1; i < 5; i++) {
      defs.append('pattern')
                .attr({
                  "id": "tarrobo"+i,
                  "x": "0",
                  "y": "0",
                  "height": "1",
                  "width": "1"
                });
    }
  }
  if (this.type === "input") {
    defs.append('pattern')
              .attr({
                "id": "tarblip",
                "x": "0",
                "y": "0",
                "height": "40",
                "width": "40"
              });
  }

};

// grabs svg and adds def to it
Canvas.prototype.appendDefsToSvg = function(){
  var svg = this.getSvg();
   svg.append('defs')
      .attr("id", this.type + "-defs");
};

// Draw our canvas depending on the type
// adds listener to input canvas
// draws targets on output
Canvas.prototype.drawCanvas = function() {
  if(!this.type) {
    console.log('Invalid Canvas Type')
    return;
  }
  // append a svg to the canvas
  this.appendSvg();
  // add drag and double click functionality to vector
  if(this.type === "input") {
    this.getCanvas().call(this.vectorDrag());
    this.drawTargetsOnCanvas();
  }
  else if(this.type === "output") {
    this.drawTargetsOnCanvas();
  }
};

// Wrapper function for drawing targets
Canvas.prototype.drawTargetsOnCanvas = function() {
  this.appendDefsToSvg();
  this.appendPatternToDefs();
  this.appendImageToPattern();
};

// Adds progress bar inbetween two canvases
Canvas.prototype.drawProgressBar = function() {
  var container = d3.select('#progress-container');
      container.append('div')
                .attr({
                  "class": "progress-bar progress-bar-success progress-bar-striped active",
                  "role": "progressbar",
                  "aria-valuenow": "0",
                  "aria-valuemin": "0",
                  "aria-valuemax": "100",
                  //"style": "width: 0%",
                  "id" : "progressbar"
                });
      container.append('span')
         .attr({
           "id": "score",
           "class": "sr-only"
         });
};

// Also not currently being used. Let's figure out if we need it.
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

Canvas.prototype.getTimer = function() {
  var date = new Date();
  return date.getTime();
};

module.exports = Canvas;
