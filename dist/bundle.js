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
	// No need for color if we use image pattern as fill
	// this.color = settings.color || '#FF0000';
	// test
	this.type = settings.type || "output";
}

Target.prototype.updateColor = function(dist, n) {
		this.color = dist;
};

Target.prototype.init = function() {
		this.drawTarget();
};


Target.prototype.drawTarget = function() {
	var score = 0,
	 		real_x = this.x - this.width / 2,
			real_y = this.y - this.height / 2;
	var rect = d3.select('#'+this.type+'-svg').append("rect")
		.attr({
			"x": real_x,
			"y": real_y,
			"width": this.width,
			"height": this.height
		})

	var tar_num = Math.floor(Math.random() * 19) + 1;
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
	this.stroke = settings.stroke || 5;
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
  this.type = settings.type || "not a valid type";
}

// Return modified d3 drag listener
// using this inside of return statement refers to d3, not Canvas
// so, self = this is used to differentiate between canvas object and d3 object.
Canvas.prototype.vectorDrag = function() {
  self = this;
  return d3.behavior.drag()
              .on("dragstart", function (){
                Sauron.tellSauron(d3.mouse(this));
              })
              .on("drag", function() {
                Sauron.tellSauron(d3.mouse(this));
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
  for(i = 1; i < 20; i++) {
    var tar = this.getTar(i);
    tar.append('image')
     .attr({
       "x": "0",
       "y": "0",
       "width": "40",
       "height": "40",
       "xlink:href": "../public/img/items/target" + i + ".gif"
     });
  }

};

// grabs def elemetn and appends a pattern on it to prep us to add imag
Canvas.prototype.appendPatternToDefs = function() {
  var defs = this.getDefs();
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
};

// grabs svg and adds def to it
Canvas.prototype.appendDefsToSvg = function(){
  var svg = this.getSvg();
   svg.append('defs')
      .attr("id", "output-defs");
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
  // add drag functionality to vector
  if(this.type === "input") {
    this.getCanvas().call(this.vectorDrag());
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
}

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

module.exports = Canvas;

},{"../sauron/sauron.js":8,"../utilities/math.js":9}],4:[function(require,module,exports){
function startLevel1() {


	var inputSettings = {
	    minX: -10,
	    minY: -10,
	    maxX: 10,
	    maxY: 10,
	    pixelWidth: 500,
	    pixelHeight: 500
	};

	var outputSettings = {
	    minX: -10,
	    minY: -10,
	    maxX: 10,
	    maxY: 10,
	    pixelWidth: 500,
	    pixelHeight: 500
	};

	var inputCanvas = canvas(inputSettings),
		outputCanvas = canvas(outputSettings),
		matrix = [[2,1],[1,-1]],
		score = 0,
		inputVector = vector(),
		oldOutputVector = vector(),
		outputVector = vector(),
		targets = [target(Math.getRandomArbitrary(-9,9), Math.getRandomArbitrary(-9,9))];
		// change math to our

	function updateLevel1(event) {

		// get coordinates
		var x = event.point.x,
			y = event.point.y;

		// update input/output vectors
		inputVector.updateVector(x,y);
		newCoordinates = applyMatrix(x,y,matrix);

		// this should copy the new into the old.
		oldOutputVector.copy(outputVector);
		outputVector.updateVector(newCoordinates[0],newCoordinates[1]);

		// draw input/output vectors
		inputCanvas.drawVector(inputVector);
		outputCanvas.drawVector(outputVector);

		// check collision (use line segments)
		var result = outputCanvas.checkCollisions(oldOutputVector,outputVector,targets);

		if(result.length !== 0)

			for(var i = 0; i < result.length; i++) {
				// change x,y values for target
				this.randomizeTarget(result[i]);
				score += 10;
			}
		}
		// calculate proximity to target and update target color
		var dist = 0;

		for(var i = 0; i < targets.length; i++) {
			dist = outputCanvas.proximity(outputVector, targets[i]);
			this.target[i].updateColor(dist);
		}

		outputCanvas.drawTargets(targets);

	}

	// accepts a single target object as input
	function randomizeTarget(target) {
		target.update(Math.getRandomArbitrary(-9,9), Math.getRandomArbitrary(-9,9));
	}

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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


// think of this as the main function :)
startPlayground = function startPlayground() {
	initPlayground();
}

module.exports = {

	initPlayground: function() {
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
	},

	startPlayground: function() {
		this.initPlayground();
	}
	
};
},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3,"../level/playgroundConfig":7,"../sauron/sauron.js":8}],7:[function(require,module,exports){
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
		matrix: [[1,2,],[2,1]]
	}
};
},{}],8:[function(require,module,exports){
var util = require('../utilities/math.js'),
		Target = require('../actors/target.js');

// Sauron is alive!
function Sauron(setting) {
	this.matrix = [[1,2],[2,1]];
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
      "stroke-width":"4",
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

// After good news from the Palantir Sauron moves forces!
Sauron.prototype.updateTargets = function(d) {
	var width = Number(d3.selectAll("rect").attr("width")),
      height = Number(d3.selectAll("rect").attr("height")),
      x = Number(d3.selectAll("rect").attr("x")) + width / 2,
      y = Number(d3.selectAll("rect").attr("y")) + height / 2,
      i = util.applyMatrix(d.x,d.y);
  if (util.isClose(i[0], i[1], x, y, width / 2, height / 2)) {
    d3.selectAll("rect").remove();
    this.updateProgress();
    this.generateTarget([[1,3],[2,0]]);
  }
};

// Palantir reveals new plans to Sauron
Sauron.prototype.tellSauron = function(event) {
	var d = this.convertMouseToCoord(event);
  this.updateInputVector(d);
  this.updateOutputVector(d);
  this.updateTargets(d);
};

Sauron.prototype.convertMouseToCoord = function(event) {
	return {
		x: event[0],
		y: event[1]
	}
};

// Strategy
Sauron.prototype.applyTransformation = function(sX,sY,matrix){
  var matrix = matrix || [[1,3],[2,0]];
  var math_coord = util.screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return util.mathToScreen(applied_coord[0],applied_coord[1]);
};

// Sauron alerts his generals of the new progress
Sauron.prototype.updateProgress = function(){
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

// The Sauron's army grows larger
Sauron.prototype.generateTarget = function(matrix) {
  var isLegal = false,
      par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
      newX, newY;

  while (!isLegal) {
    newX = util.getRandom(0,500);
    newY = util.getRandom(0,500);
    var pre = util.screenToMath(newX,newY);
    var prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / par,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / par;
    pre = util.mathToScreen(prex,prey);

    if (pre[0] >= 0 && pre[0] <= 500 && pre[1] >= 0 && pre[1] <= 500) {
      isLegal = true;
      var targetSettings = {
      	x: newX,
      	y: newY,
      	width: 40,
				height: 40,
      	color: "black"
      };
      var newTarget = new Target(targetSettings);
      newTarget.drawTarget();
    }
  }
}

// Sauron is mobilized via Smaug!
module.exports = new Sauron();
// module.exports = {
// 	applyTransformation: function(sX,sY,matrix){
// 	  var matrix = matrix || [[1,3],[2,0]];
// 	  var math_coord = util.screenToMath(sX,sY),
// 	      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
// 	  return util.mathToScreen(applied_coord[0],applied_coord[1]);
// 	},

// 	updateInputVector: function(d) {
// 	// redraw input vector
// 	  d3.select('#input-vector').remove();
// 	  d3.select('#input-svg').append('path')
// 	    .attr({
// 	      "stroke": "red",
// 	      "stroke-width":"4",
// 	      "d": "M 250 250 L"+d.x+" "+d.y+"z",
// 	      "id": 'input-vector'
// 	  });
// 	},

// 	updateOutputVector: function(d) {
// 	  var i = this.applyTransformation(d.x,d.y);
// 	  d3.select('#output-vector').remove();
// 	  d3.select('#output-svg').append('path')
// 	    .attr({
// 	      "stroke": "red",
// 	      "stroke-width":"4",
// 	      "d": "M 250 250 L"+i[0]+" "+i[1]+"z",
// 	      "id": 'output-vector'
// 	  });
// 	},

// 	updateTargets: function(d) {
// 	  var x = d3.selectAll("circle").attr("cx"),
//     y = d3.selectAll("circle").attr("cy"),
//     r = d3.selectAll("circle").attr("r"),
//     i = this.applyTransformation(d.x,d.y);
// 	  if (isClose(i[0],i[1],x,y,r)) {
// 	    d3.selectAll("circle").remove();
// 	    updateProgress();
// 	    generateTarget([[1,3],[2,0]]);
// 	  }
// 	},

// 	tellSauron: function(d) {
// 	  this.updateInputVector(d);
// 	  this.updateOutputVector(d);
// 	  this.updateTargets(d);
// 	}
// };

},{"../actors/target.js":1,"../utilities/math.js":9}],9:[function(require,module,exports){
module.exports = {

	screenToMath: function(x,y) {
	  return [(x - 250) * 10 / 250, - (y - 250) * 10 / 250];
	},

	mathToScreen: function(x,y) {
	  return [x * 250 / 10 + 250, - y * 250 / 10 + 250];
	},

	applyMatrix: function(sX,sY,matrix) {
	  var matrix = matrix || [[1,3],[2,0]];
	  var math_coord = this.screenToMath(sX,sY),
	      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
	  return this.mathToScreen(applied_coord[0],applied_coord[1]);
	},

	getRandom: function(min,max) {
	  return Math.random() * (max - min) + min;
	},

	isClose: function(oX, oY, tX, tY, xb, yb) {
  	return (Math.abs(tX - oX) <= xb ) && (Math.abs(tY - oY) <= yb);
	}
};

},{}]},{},[1,2,3,4,5,6,7,8,9]);
