(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* TARGET CONSTRUCTOR
*
  var settings = {
	x: 2,
	y: 2,
	ttl: 30,
	color:  ,
  };
*
*/

function Target(settings) {
	this.x = settings.x || 300;
	this.y = settings.y || 300;
	this.width = settings.width || 40;
	this.height = settings.height || 40;
	this.ttl = settings.ttl;
	this.id = settings.id || "ringWraith_0";
	this.type = settings.type || "output";
}

Target.prototype.updateColor = function(dist, n) {
		this.color = dist;
};

Target.prototype.init = function() {
		this.drawTarget();
};


Target.prototype.drawTarget = function() {
	var tar_num = Math.floor(Math.random() * 19) + 1,
			score = 0,
	 		real_x = this.x - this.width / 2,
			real_y = this.y - this.height / 2;
	
	var rect = d3.select('#'+this.type+'-svg').append("rect")
		.attr({
			"x": real_x,
			"y": real_y,
			"width": this.width,
			"height": this.height,
			"id": this.id
		})

	
	rect.style({"fill": "url(#tar" + tar_num + ")"});
};


module.exports = Target;
},{}],2:[function(require,module,exports){
/**
VECTOR constuctor
Sample settings object

	var inputVectorSettings = {
		type: "input",
		tail: {
			x: 250,
			y: 250
		},
		head: {
			x: 350,
			y: 100
		}
	}
*/
// Really the vector shouldn't know about its screen coordinates.
// These should be math coordinates.
// When we draw this vector to the canvas, the canvas should tell the vector how its math coordinates translate into screen coordinates,
// *for that canvas*.
function Vector(settings) {
	this.head = {
		x: settings.head.x || 250,
		y: settings.head.y || 250
	};
	// we don't want to move the tail from the origin
	this.tail = {
		x: settings.tail.x || 250,
		y: settings.tail.y || 250
	}
	this.color = settings.color || "#92989F";
	this.type = settings.type || "input";
	this.stroke = settings.stroke || 150;
};

/*
* INITIALIZES vector on a page
* NO PARAM NO RETURNS
*/
Vector.prototype.init = function() {
	this.drawVector();
};

/*
* Draws a vector depending on which canvas
* NO PARAMS. NO RETURNS
*/
Vector.prototype.drawVector = function() {
	if(this.type) {
		d3.select('#'+this.type+'-svg')
			.append("path") // vector itself
			.attr({
				"stroke": this.color,
	    	"stroke-width":this.stroke,
	    	// "fill": "value" // test this with a graphic?
	    	"d": this.generatePath(),
	    	"id": this.type+'-vector',
			});
	}
	else {
		console.log("Invalid vector type: ",this.type);
	}
};

/*
* Generates path value based on properties on instance of vector
* param optional
* RETURNS path to be drawn
*/
Vector.prototype.generatePath = function() {
	return "M"+this.tail.x+" "+this.tail.y+" L"+this.head.x+" "+this.head.y+" z";
};

module.exports = Vector;

},{}],3:[function(require,module,exports){
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
                Sauron.tellSauron(d3.mouse(this), "drag");
                Sauron.tutorialControl(2,500);
                // If you want the single click instead of double, replace the
                //  next four lines until but not including '})' with
                //  Sauron.tellSauron(d3.mouse(this), "dbclick");
                var newTimer = self.getTimer();
                if (newTimer - self.timer <= 200) {
                  Sauron.tellSauron(d3.mouse(this), "dbclick");
                }
                self.timer = newTimer;
              })
              .on("drag", function() {
                Sauron.tellSauron(d3.mouse(this), "drag");
                Sauron.tutorialControl(3,500);
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
// To randomize targets write function to randomly grab a .gif from ../public/img/*
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
                 "xlink:href": "../public/img/items/glow/target" + i + ".gif"
               });
    }
    var arm = this.getTar("arm");
    arm.append('image')
             .attr({
               "x": "0",
               "y": "0",
               "width": "30px",
               "height": "100px",
               "xlink:href": "../public/img/robotarm.gif"
             });
  }
  if (this.type === "input") {
    var blip = this.getTar("blip");
    blip.append('image')
              .attr({
                "x": "0",
                "y": "0",
                "width": "40",
                "height": "40",
                "xlink:href": "../public/img/blip.gif"
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

},{"../sauron/sauron.js":11,"../utilities/math.js":12}],4:[function(require,module,exports){
/**
* Level Tracking
* @description: Mechanism for tracking levels in gameplay
*/

// Track the levels
var levelTracking = 1;
function loadPage(id, levelMove, guide){
  var currentLevel = levelTracking + parseInt(levelMove);

  if(currentLevel < 1) {
    document.getElementById("lowerBoundLevel").disabled = "disabled";
    document.getElementById("upperBoundLevel").disabled = "";
    document.getElementById("lowerBoundGuide").disabled = "disabled";
    document.getElementById("upperBoundGuide").disabled = "";
    levelTracking = 1;
  } else if ( currentLevel > 3 ) {
    document.getElementById("lowerBoundLevel").disabled = "";
    document.getElementById("upperBoundLevel").disabled = "disabled";
    document.getElementById("lowerBoundGuide").disabled = "";
    document.getElementById("upperBoundGuide").disabled = "disabled";
    levelTracking = 3;
  } else {
    document.getElementById("lowerBoundLevel").disabled = "";
    document.getElementById("upperBoundLevel").disabled = "";
    document.getElementById("lowerBoundGuide").disabled = "";
    document.getElementById("upperBoundGuide").disabled = "";
    levelTracking = currentLevel;
  }

  var dataText = "../level" + levelTracking
  var idText = "level" + levelTracking;
  if(guide == 0) {
    dataText = dataText + "/index.html";
    idText = idText + "Game";
  } else if(guide == 1) {
    dataText = dataText + "guide/index.html";
    idText = idText + "Guide";
  }

  document.getElementById(id).innerHTML='<object id='+ idText +' type="text/html" data=' + dataText + ' height="100%" width="100%"></object>';
}

// Show info button after a certain amount of time
setTimeout(function() {
  $('.infoLeft').fadeIn();
}, 5000);

},{}],5:[function(require,module,exports){
var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js');
		config = require('../level/playgroundConfig');

function initPlayground() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings),
			outputTarget = new Target(config.targetSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();

	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	outputTarget.init()
}

// Requires JQuery
function initTutorial() {
	// Initialize
	$(window).ready(function(){
		// Initialize Popover
		$('#tutorial').popover();
		// Dismissable when clicking general window elements
		$(window).click(function() {
				$('#tutorial').popover('hide');
				Sauron.tutorial.show = false;
		});
	});
	// Load starting tutorial
	Sauron.tutorialControl(1,1000);
}

// think of this as the main function :)
startPlayground = function startPlayground() {
	initPlayground();
	initTutorial();
}

},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3,"../level/playgroundConfig":9,"../sauron/sauron.js":11}],6:[function(require,module,exports){
module.exports = {

	inputCanvasSettings : {
		type: "input",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		pixelWidth: 500,
		pixelHeight: 500
	},

	outputCanvasSettings : {
		type: "output",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		pixelWidth: 500,
		pixelHeight: 500
	},

	inputVectorSettings : {
		type: "input",
		tail: {
			x: null,
			y: null
		},
		head: {
			x: null,
			y: null
		}
	},

	outputVectorSettings : {
		type: "output",
		tail: {
			x: null,
			y: null
		},
		head: {
			x: null,
			y: null
		}
	}
};
},{}],7:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],8:[function(require,module,exports){
var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		config = require('../game2/config.js');

function initLevel2() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();

	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	Sauron.generateRandomLineofDeath();
}


// think of this as the main function :)
startLevel2 = function startLevel2() {
	initLevel2();
}
},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3,"../game2/config.js":6,"../sauron/sauron.js":11}],9:[function(require,module,exports){
module.exports = {

	inputCanvasSettings : {
		type: "input",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		pixelWidth: 500,
		pixelHeight: 500
	},

	outputCanvasSettings : {
		type: "output",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		pixelWidth: 500,
		pixelHeight: 500
	},

	inputVectorSettings : {
		type: "input",
		tail: {
			x: null,
			y: null
		},
		head: {
			x: null,
			y: null
		}
	},

	outputVectorSettings : {
		type: "output",
		tail: {
			x: null,
			y: null
		},
		head: {
			x: null,
			y: null
		}
	},

	targetSettings : {
		x: 355,
		y: 50,
		r: 20
	},

	EyeOfSauron : {
		matrix: [[1,2],[2,1]]
	}
};
},{}],10:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],11:[function(require,module,exports){
var util = require('../utilities/math.js'),
    Target = require('../actors/target.js');

// Sauron is alive!
function Sauron(settings) {
  this.matrix = [[1,2],[2,1]];
  // timer: null
  this.armies = [];
  this.tutorial =  {num: 1, show: false};
}

// Given a matrix and a pair (x,y) of screen coordinates, convert to math coord and applies LT
// Returns LinearTransformationScreen(x,y) coordinates
Sauron.prototype.applyTransformation = function(sX,sY,matrix){
  var matrix = matrix || [[1,3],[2,0]];
  var math_coord = util.screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return util.mathToScreen(applied_coord[0],applied_coord[1]);
};

// Sauron destroys a vector and creates a new one
Sauron.prototype.updateInputVector = function(d){
  this.removeVector('input');
  d3.select('#input-svg').append('path')
    .attr({
      "stroke": "#31BA29",
      "stroke-width":"8",
      "d": "M 250 250 L"+d.x+" "+d.y+"z",
      "id": 'input-vector'
  });
};

// Sauron takes no pitty on a vector and destroys it.
Sauron.prototype.removeVector = function(type) {
  d3.select('#'+type+'-vector').remove();
};

// Sauron makes a strategic decicision and modifies a vector
Sauron.prototype.updateOutputVector = function(d) {
  var i = this.applyTransformation(d.x,d.y);
  this.removeVector('output');
  d3.select('#output-svg').append('path')
    .attr({
      "stroke": "#92989F",
      "stroke-width":"5",
      "d": "M 250 250 L"+i[0]+" "+i[1]+"z",
      "id": 'output-vector'
  });
};

Sauron.prototype.getArmies = function() {
  return d3.select("#output-svg").selectAll('rect')[0];   
};

// After good news from the Palantir Sauron moves forces!
Sauron.prototype.updateTargets = function(d, type) {
  var list = this.getArmies();
 
  for ( var j = 0; j < list.length ; j++ ) {
    var wraith = d3.select("#ringWraith_"+j);

    if(wraith[0]["0"] === null || wraith[0][0] === null) {
      continue;
    }
    var width = Number(wraith.attr("width")),
        height = Number(wraith.attr("height")),
        x = Number(wraith.attr("x")) + width / 2,
        y = Number(wraith.attr("y")) + height / 2,
        i = util.applyMatrix(d.x,d.y);

    // collison detection occurs here
    if (util.isClose(i[0], i[1], x, y, width / 2, height / 2)) {
      if (type === "collision") {
        wraith.remove()
        this.updateProgress();
        this.generateTarget([[1,3],[2,0]]);
        this.drawBlips(d);
      }
      else if (type === "detection") {
        this.tutorialControl(4,1);
      }
    }
  }

};

// Palantir reveals new plans to Sauron
Sauron.prototype.tellSauron = function(event, type) {
  var d = this.convertMouseToCoord(event);
  if (type === "drag") {
    this.updateInputVector(d);
    this.updateOutputVector(d);
    if (this.tutorial.show === false) {
      this.updateTargets(d, "detection");
    }
  }
  else if (type === "dbclick") {
    this.updateTargets(d, "collision");
  }
};

Sauron.prototype.convertMouseToCoord = function(event) {
  return {
    x: event[0],
    y: event[1]
  }
};

// Strategy
Sauron.prototype.applyTransformation = function(sX,sY,matrix) {
  var matrix = matrix || [[1,3],[2,0]];
  var math_coord = util.screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return util.mathToScreen(applied_coord[0],applied_coord[1]);
};

// Sauron alerts his generals of the new progress
Sauron.prototype.updateProgress = function() {
  var bar = d3.select('#progressbar'),
      scoreBox = d3.select('#score');
      currScore = bar.attr("aria-valuenow");
      if (Number(currScore) >= 100) {
        currScore = 100;
        scoreBox.text("Proceed To Next Level!");
      }
      else {
        currScore = Number(currScore) + 5;
        scoreBox.text(currScore + "% Complete");
      }

      bar.style("width", currScore + "%");
      bar.attr("aria-valuenow", currScore);
};

// The Sauron's army grows larger
// Slightly not optimal
// If matrix is invertible
// Divide by 0 then breaks
Sauron.prototype.generateTarget = function(matrix) {
  var isValidCoordinate = false,
      par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
      newX, newY;

  while (!isValidCoordinate) {
    var point = {
      x: util.getRandom(0, 500),
      y: util.getRandom(0, 500)
    };

    if ( util.isOnScreen(matrix, point)) {
      isValidCoordinate = true;
      var targetSettings = {
        x: point.x,
        y: point.y,
        width: 40,
        height: 40,
        color: "black",
        id: "ringWraith_0"
      };
      var newTarget = new Target(targetSettings);
      newTarget.drawTarget();
    }
  }
};

Sauron.prototype.tutorialControl = function(num, time) {
  if (this.tutorial.show === false && num === this.tutorial.num) {
    if (num === 1) {
      this.tutorial.num++;
      d3.select('#tutorial').attr("data-content", "Click the radar screen to activate the robot arm!");
    };
    if (num === 2) {
      this.tutorial.num++;
      d3.select('#tutorial').attr("data-content", "Click and drag the arm in the radar screen to move the robot's arm!");
    };
    if (num === 3) {
      this.tutorial.num++;
      d3.select('#tutorial').attr("data-content", "Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.");
    };
    if (num === 4) {
      this.tutorial.num++;
      d3.select('#tutorial').attr("data-content", "Double click the radar screen to collect the part");
    };
    setTimeout(function() {
        $('#tutorial').popover('show');
        this.tutorial.show = true;
      }, time);
    // Auto-dismiss, Want to do as a separate part, watching Sauron.tutorial.show
    // setTimeout(function() {
    //     $('#tutorial').popover('hide');
    //     this.tutorial.show = false;
    //   }, 6000);
   }
};

Sauron.prototype.generateRandomLineofDeath = function() {
  var validPoints = [{x:0,y:0},{x:5*(Math.sqrt(2)/2),y:5*(Math.sqrt(2)/2)},{x:5*Math.sqrt(2),y:5*Math.sqrt(2)},{x:-1*(5*Math.sqrt(2)/2),y:-1*(5*Math.sqrt(2)/2)},{x:-1*(5*Math.sqrt(2)),y:-1*(5*Math.sqrt(2))}];//util.getValidPreImagePairs(),
      i = 0;


  for( var key in validPoints ) {
  
    var pair = validPoints[key],
        screenCoors = util.mathToScreen(pair.x, pair.y, this.matrix);
    pair.x = screenCoors[0];
    pair.y = screenCoors[1];
    
    var targetSetting = {
      x: pair.x,
      y: pair.y,
      width: 40,
      height: 40,
      color: "black",
      id: "ringWraith_"+i
    };
    var newTarget = new Target(targetSetting);
    newTarget.drawTarget();
    i++;
  }
};

Sauron.prototype.drawBlips = function(d) {
      d3.select("#input-svg").append("circle")
                    .attr({
                      cx: d.x,
                      cy: d.y,
                      r: 20,
                    })
                    .style({"fill": "url(#tarblip)"});
}

// Sauron is mobilized via Smaug!
module.exports = new Sauron();

},{"../actors/target.js":1,"../utilities/math.js":12}],12:[function(require,module,exports){
module.exports = {

	screenToMath: function(x,y) {
	  return [(x - 250) * 10 / 250, - (y - 250) * 10 / 250];
	},

	mathToScreen: function(x,y) {
	  return [x * 250 / 10 + 250, - y * 250 / 10 + 250];
	},

	applyMatrix: function(sX,sY,matrix) {
	  var matrix = matrix || [[.8,3],[2,0]];
	  console.log('matrix ', matrix)
	  var math_coord = this.screenToMath(sX,sY),
	      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
	  return this.mathToScreen(applied_coord[0],applied_coord[1]);
	},

	getRandom: function(min,max) {
	  return Math.random() * (max - min) + min;
	},

	isClose: function(oX, oY, tX, tY, xb, yb) {
  	return (Math.abs(tX - oX) <= xb ) && (Math.abs(tY - oY) <= yb);
	},

	isOnScreen: function(matrix, point) {
		var pre = this.screenToMath(point.x, point.y);
		var par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    var prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / par,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / par;
    pre = this.mathToScreen(prex,prey);

     if (pre[0] >= 0 && pre[0] <= 500 && pre[1] >= 0 && pre[1] <= 500) {
     	return true;
     } 
     else {
     	return false;
     }
	},

	getValidPreImagePairs: function(matrix) {
		
		var validPoints = [],
				i = 1,
				d = 2,
		 		angle = Math.PI * Math.random(),
				shift = Math.random() * 2,
				unitVector = {
					x: Math.cos(angle),
					y: Math.sin(angle)
				},
				origin = {
					x: 0,
					y: 0
				},
				firstPoint = {
					x: ((d/2) - shift) * unitVector.x,
					y: ((d/2) - shift) * unitVector.y
				};

		// move to left most point
		while( Math.abs(firstPoint.x) < 10 && Math.abs(firstPoint.y) < 10 ) {
	
			firstPoint.x = firstPoint.x - i * d * unitVector.x;
			firstPoint.y = firstPoint.y - i * d * unitVector.y;
			i++;
	
		}

			
		// validPoints.push(origin);
		i = 1;

		while ( validPoints.length < 10 ) {

			validPoints.push({
				x: firstPoint.x + i * d * unitVector.x,
				y: firstPoint.y + i * d * unitVector.y
			});
			i++;
		
		}
		return validPoints;
	}
};

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12]);
