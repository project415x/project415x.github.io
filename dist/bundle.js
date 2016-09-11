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
	this.id = settings.id || "random";
	this.type = settings.type || "output";
}
/**
 * [updateColor Not currently in use. In ]
 * @param  {[type]} dist [dist]
 * @return {[none]}      
 */
Target.prototype.updateColor = function(dist) {
		this.color = dist;
};

/**
 * [init draws the first target on the canvas]
 * @return {[none]} 
 */
Target.prototype.init = function() {
		this.drawTarget();
};

/**
 * [drawTarget draws target onto canvas ]
 * @return {[none]} []
 */
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
	this.stroke = settings.stroke || 8;
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
    OverWatcher = new Sauron({}),
    Tutorial = require('../tutorial/tutorial.js'),
    utils = require('../utilities/math.js');

function Canvas(settings) {
  //input error handling
  this.minX = settings.minX || -10,
  this.minY = settings.minY || -10,
  this.maxX = settings.maxX || 10,
  this.maxY = settings.maxY || 10,
  this.pixelWidth = settings.pixelWidth || 400,
  this.pixelHeight = settings.pixelHeight || 400,
  this.originX = ( this.pixelWidth * (-this.minX)/(this.maxX - this.minX)) || 200,
  this.originY = ( this.pixelHeight * (-this.minY)/(this.maxY - this.minY)) || 200,
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
                Tutorial.tutorialControl(2,500);
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
                Tutorial.tutorialControl(3,500);
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
                "height": "200px",
                "width": "30px"
              })
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

},{"../sauron/sauron.js":12,"../tutorial/tutorial.js":13,"../utilities/math.js":14}],4:[function(require,module,exports){
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
		},
		stroke: 9
	},

	targetSettings : {
		x: 355,
		y: 50,
		r: 20
	},

	sauron : {
		matrix: [[1,2],[2,1]],
		level: 1,
		type: "random"
	}
};

},{}],5:[function(require,module,exports){
var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		Tutorial = require('../tutorial/tutorial.js'),
		config = require('./config.js'),
		Level1 = new Sauron(config.sauron);

function initTutorial() {
	// Requires JQuery included on each page
	$(window).ready(function() {
		// Initialize Tutorial
		Tutorial.init()
		// Dismissable when clicking general window elements
		$('#guide').click(function(event) {
				var guide = document.getElementById('guide');
				var img = document.getElementById('tutorial');
				if(!Tutorial.show) {
					return;
				}
				if((event.target == img || event.target == guide) && Tutorial.reopen) {
					return;
				}
				Tutorial.clearTimer();
				$('#tutorial').popover('hide');
				Tutorial.show = false;
				Tutorial.reopen = true;
		});
		// Reopen tutorial
		$('#tutorial').click(function(event) {
			if(Tutorial.show || !Tutorial.reopen) {
				return;
			}
			Tutorial.tutorialControl(--Tutorial.num,1,true);
		});
		// Load starting tutorial
		Tutorial.tutorialControl(1,1000);
	});
}
function initLevel1() {
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
	Level1.generateRandomLineofDeath();
}


// think of this as the main function :)
startLevel1 = function startLevel1() {
	initLevel1();
	initTutorial();
}

},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3,"../sauron/sauron.js":12,"../tutorial/tutorial.js":13,"./config.js":4}],6:[function(require,module,exports){
/**
* Level Tracking
* @description: Mechanism for tracking levels in gameplay
*/

// Track the levels
var levelTracking = 1;
function loadPage(id, levelMove, guide){
  var currentLevel = levelTracking + parseInt(levelMove);

  if(currentLevel <= 1) {
    document.getElementById("lowerBoundLevel").disabled = "disabled";
    document.getElementById("upperBoundLevel").disabled = "";
    document.getElementById("lowerBoundGuide").disabled = "disabled";
    document.getElementById("upperBoundGuide").disabled = "";
    levelTracking = 1;
  } else if ( currentLevel >= 3 ) {
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

},{}],7:[function(require,module,exports){
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
		},
		stroke: 9
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

	sauron : {
		matrix: [[1,2],[2,1]],
		level: 2,
		type: "line"
	}
};

},{}],8:[function(require,module,exports){
var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		config = require('./config.js'),
		OverWatcher = new Sauron(config.sauron);

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
	OverWatcher.generateRandomCircleofDeath();
}


// think of this as the main function :)
startLevel2 = function startLevel2() {
	initLevel2();
}

},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3,"../sauron/sauron.js":12,"./config.js":7}],9:[function(require,module,exports){
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
		},
		stroke: 9
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

	sauron : {
		matrix: [[1,2],[2,1]],
		level: 3,
		type: "circle"
	}
};

},{}],10:[function(require,module,exports){
var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		config = require('./config.js'),
		OverWatcher = new Sauron(config.sauron);

function initLevel3() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings);
			//outputTarget = new Target(config.targetSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();

	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	OverWatcher.generateTarget();
}


// think of this as the main function :)
startLevel3 = function startLevel3() {
	initLevel3();
}

},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3,"../sauron/sauron.js":12,"./config.js":9}],11:[function(require,module,exports){
/**
* Level Tracking
* @description: Mechanism for tracking levels in gameplay
*/

// Track the levels
var levelTracking = 1;
function loadPage(id, levelMove, guide){
  var currentLevel = levelTracking + parseInt(levelMove);

  if(currentLevel <= 1) {
    document.getElementById("lowerBoundLevel").disabled = "disabled";
    document.getElementById("upperBoundLevel").disabled = "";
    document.getElementById("lowerBoundGuide").disabled = "disabled";
    document.getElementById("upperBoundGuide").disabled = "";
    levelTracking = 1;
  } else if ( currentLevel >= 3) {
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

  document.getElementById(id).innerHTML='<object id='+ idText +' type="text/html" data=' + dataText + ' height="90%" width="100%"></object>';
}

// Show info button after a certain amount of time
setTimeout(function() {
  $('.infoLeft').fadeIn();
}, 5000);

},{}],12:[function(require,module,exports){
var util = require('../utilities/math.js'),
    Target = require('../actors/target.js'),
    Tutorial = require('../tutorial/tutorial.js');

// Sauron is alive!
/*
  Default constuctor
  Sample settings object in game1, game2, game3
*/
function Sauron(settings) {
  this.matrix = [[1,2],[2,1]];
  this.armies = [];
  this.level = settings === {} ? -1 : settings.level;
  this.deathToll = 0;
}

/*
  Given a matrix and a pair (x,y) of screen coordinates, convert to math coord and applies LT
  Returns LinearTransformationScreen(x,y) coordinates
*/
Sauron.prototype.applyTransformation = function(sX,sY,matrix){
  var matrix = this.matrix;
  var math_coord = util.screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return util.mathToScreen(applied_coord[0],applied_coord[1]);
};

/*
  Sauron destroys a vector and creates a new one
  @param {OBJECT(int,int)}
  @return void
*/
Sauron.prototype.updateInputVector = function(d) {
  this.removeVector('input');
  d3.select('#input-svg').append('path')
    .attr({
      "stroke": "#31BA29",
      "stroke-width":"8",
      "d": "M 250 250 L"+d.x+" "+d.y+"z",
      "id": 'input-vector'
  });
};

/*
  Sauron takes no pitty on a vector and destroys it.
  @param {string} type of vector
  @returns void
*/
Sauron.prototype.removeVector = function(type) {
  d3.select('#'+type+'-vector').remove();
};

/*
  Sauron makes a strategic decicision and modifies a vector
  @param {object(int,int)}
  @return void
*/
Sauron.prototype.updateOutputVector = function(d) {
  var i = util.applyMatrix(d.x, d.y, this.matrix);
  this.removeVector('output');
  var height = Math.sqrt((250 - i[0])*(250 - i[0]) + (250 - i[1])*(250 - i[1]));
  var angle = -1*Math.atan((i[0]-250.0)/(i[1]-250.0)) * 180.0 / Math.PI;
  if(i[1] > 250){
      angle += 180;
  }
  var width = 20;
  var ratio = "none";
  if(height < 300) {
      ratio = "xMinYMin slice";
  }
  if(d3.select('#output-vector').size() ===0){
      var arm = d3.select('#output-svg').append('image')
        .attr({
            "x": (i[0] - width/2),
            "y": i[1],
            "width": ""+ width +"px",
            "height": "" + height +"px",
            "preserveAspectRatio" : ratio,
            "id": 'output-vector',
            "xlink:href": "../public/img/robotarm.gif",
            "transform" : 'rotate('+angle +',' + i[0] + ',' + i[1] + ')'
      });
      //arm.style({"fill": "red"});
  }else{
      d3.select('#output-vector')
        .attr({
            "x": (i[0] - width/2),
            "y": i[1],
            "width": ""+ width +"px",
            "height": "" + 100 +"px",
            "preserveAspectRatio" : ratio,
            "transform" : 'rotate('+angle +',' + i[0] + ',' + i[1] + ')'
      });
  }
  //arm.style({"fill": "red"});
  // d3.select('#output-svg').append('path')
  //   .attr({
  //      "stroke": "#92989F",
  //      "stroke-width":"9",
  //      "d": "M 250 250 L"+i[0]+" "+i[1]+"z",
  //      "id": 'output-vector'
  // });
};

/*
  Sauron gets all of the targes in the output svg
  @returns {array} of dom nodes
*/
Sauron.prototype.getArmies = function() {
  return d3.select("#output-svg").selectAll('rect')[0];
};

/*
  After good news from the Palantir Sauron moves forces!
  @param {obj(int,int)} d
  @param {string} type
  @returns {}
*/
Sauron.prototype.blink = function(id){
  var wraith = d3.select("#"+id),
  width = Number(wraith.attr("width")),
  height = Number(wraith.attr("height")),
  x = Number(wraith.attr("x")) + width / 2,
  y = Number(wraith.attr("y")) + height / 2;

  //prevents this function from being called again
  wraith.style("opacity", 0.9);

  (function repeat(){
    if (wraith.attr("class") === "clicked" ||  wraith.attr("class") === "dead"){
      return;
    }

    function rotTween() {
      var i = d3.interpolate(0, 360);
        return function(t) {
          return "rotate(" + i(t) + ","+x+","+y+")";
      };
    }

    wraith = wraith.transition().attrTween("transform", rotTween).duration(1000)
                  .transition().style("opacity", 0.5).duration(250)
                  .transition().style("opacity", 0.9).duration(250).each("end", repeat);
  })();
}

Sauron.prototype.updateTargets = function(d, type) {
  var list = this.getArmies();
  var i = util.applyMatrix(d.x,d.y,this.matrix);
  for ( elem in list ) {
    if(list[elem].id === "output-svg" ) {
      continue;
    }
    if(list[elem].id === "output-vector"){
        continue;
    }
    var id = list[elem].id,
        wraith = d3.select("#"+id),
        width = Number(wraith.attr("width")),
        height = Number(wraith.attr("height")),
        x = Number(wraith.attr("x")) + width / 2,
        y = Number(wraith.attr("y")) + height / 2;
    if (wraith.attr("class") === "clicked" || wraith.attr("class") === "dead"){
      continue;
    }
    if (util.isInRange(i[0], i[1], x, y, width / 2, height / 2, 2)) {
      if (wraith.style("opacity")==1){
        this.blink(id);
      }

    }
    else{
      wraith.transition().style("opacity", 1).attrTween("transform", function(){
        return function(){
          return "rotate(0,"+x+","+y+")";
        };
      });
    }
    // collison detection occurs here
    if (util.isClose(i[0], i[1], x, y, width / 2, height / 2)) {
      if (type === "collision") {

        wraith.attr("class", "clicked");
        wraith.transition().style("opacity", 0.4).attrTween("transform", function(){
          return function(){
            return "rotate(0,"+x+","+y+")";
          };
        }).duration(250);
        this.deathToll++;

        this.updateProgress();
        this.drawBlips(x,y);

        if( list.length - d3.selectAll(".clicked").size() === 0 ) {
          this.generateNewTargets(id);
        }

      }
      else if (type === "detection") {
        Tutorial.tutorialControl(4,1);
      }
    }
  }
};
/*

  @param {} none
  @returns {} int
*/
Sauron.prototype.checkNumberOfBlips = function() {
  return d3.select("#input-svg").selectAll("circle")[0].length;
};

Sauron.prototype.removeBlips = function() {
    this.deathToll = 0;
    d3.select("#input-svg").selectAll("circle").transition().style("opacity",0).duration(2000);
    setTimeout(function() {
      d3.select("#input-svg").selectAll("circle").remove();
    }, 2100);

    //changing class name to prevent unwanted behaviour
    d3.selectAll(".clicked").attr("class", "dead").transition().style("opacity",0).duration(2000);
    setTimeout(function() {
      d3.selectAll(".dead").remove();
    }, 2100);
};


/*
  Depending on level, logic to draw new targets
  @param {string} id , of dom element related to target
  @returns {}
*/
Sauron.prototype.generateNewTargets = function(id) {
  if (id.indexOf("random") !== -1) {
   if(this.checkNumberOfBlips() >= 5) {
      this.deathToll = 0;
      this.removeBlips();
    }
    this.generateTarget();
  }
  else if (id.indexOf("line") !== -1) {
    this.removeBlips();
    this.generateRandomLineofDeath();
  }
  else if (id.indexOf("circle") !== -1) {
    this.removeBlips();
    this.generateRandomCircleofDeath();
  }
}

/*
  Palantir reveals new plans to Sauron
  What do to when an event is registered on the input canvas
  @param {d3 event} event
  @param {string} type
  @return {}
*/
Sauron.prototype.tellSauron = function(event, type) {
  var d = this.convertMouseToCoord(event);
  if (type === "drag") {
    this.updateInputVector(d);
    this.updateOutputVector(d);
    if (!Tutorial.show || !Tutorial.reopen) {
      this.updateTargets(d, "detection");
    }
  }
  else if (type === "dbclick") {
    this.updateTargets(d, "collision");
  }
};

/*
  Converts d3 event to x,y screen coordinates
  @param {d3 event} event
  @returns {obj(int,int)}
*/
Sauron.prototype.convertMouseToCoord = function(event) {
  return {
    x: event[0],
    y: event[1]
  }
};

/*
  Sauron alerts his generals of the new progress
  Updates score when target is clicked on
  @param {}
  @return {}
*/
Sauron.prototype.updateProgress = function() {
  var bar = d3.select('#progressbar'),
      scoreBox = d3.select('#score');
      currScore = bar.attr("aria-valuenow");
      if (Number(currScore) >= 100) {
        currScore = 100;
        scoreBox.text("Proceed To Next Level!");
      }
      else {
        if(this.level <= 1) {
          currScore = Number(currScore) + 100 / 20;
        }
        else {
          currScore = Number(currScore) + 100 / 24;
        }
        scoreBox.text(currScore + "% Complete");
      }

      bar.style("width", currScore + "%");
      bar.attr("aria-valuenow", currScore);
};

/*
  Draws random target on output svg
  @param {}
  @return {}
  The Sauron's army grows larger
  Slightly not optimal
  If matrix is invertible
  Divide by 0 then breaks
*/
Sauron.prototype.generateTarget = function() {
  var isValidCoordinate = false,
      matrix = this.matrix,
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
        id: "random_"+this.deathToll
      };
      this.drawTarget(targetSettings);
    }
  }
};
/*
  Draws blips that are dropped onto input svg
  @param {int} x
  @param {int} y
  @returns void
*/
Sauron.prototype.drawBlips = function(x,y) {
  var point = util.applyInverse(x, y, this.matrix);
  d3.select("#input-svg").append("circle")
                          .attr({
                            cx: point.x,
                            cy: point.y,
                            r: 20,
                          })
                          .style({"fill": "url(#tarblip)"});
};
/*
  Draws random circle of targets onto output svg
  @params {}
  @returns {}
*/
Sauron.prototype.generateRandomCircleofDeath = function() {

  var validPoints = util.getValidPreImageOval(this.matrix),
      i = 0;

  for( var key in validPoints ) {
    var pair = validPoints[key],
        screenCoors = util.mathToScreen(pair.x, pair.y, this.matrix);

    var targetSetting = {
      x: screenCoors[0],
      y: screenCoors[1],
      width: 40,
      height: 40,
      color: "black",
      id: "circle_"+i
    };
    this.drawTarget(targetSetting);
    i++;
  }
};


//[{x:0,y:0},{x:5*(Math.sqrt(2)/2),y:5*(Math.sqrt(2)/2)},{x:5*Math.sqrt(2),y:5*Math.sqrt(2)},{x:-1*(5*Math.sqrt(2)/2),y:-1*(5*Math.sqrt(2)/2)},{x:-1*(5*Math.sqrt(2)),y:-1*(5*Math.sqrt(2))}];
/*
  Draws random line of targets onto output svg
  @param {}
  @return {} void
*/
Sauron.prototype.generateRandomLineofDeath = function() {

  var validPoints = util.getValidPreImagePairs(),
      i = 0;

  for( var key in validPoints ) {
    var pair = validPoints[key],
        screenCoors = util.mathToScreen(pair.x, pair.y, this.matrix);

    var targetSetting = {
      x: screenCoors[0],
      y: screenCoors[1],
      width: 40,
      height: 40,
      color: "black",
      id: "line_"+i
    };
    this.drawTarget(targetSetting);
    i++;
  }
};

/**
  Wrapper for Target class.
  @param {obj} settings
  @returns void
*/
Sauron.prototype.drawTarget = function(settings) {
  var newTarget = new Target(settings);
  newTarget.drawTarget();
};

// Sauron is mobilized via Smaug!
module.exports = Sauron;

},{"../actors/target.js":1,"../tutorial/tutorial.js":13,"../utilities/math.js":14}],13:[function(require,module,exports){
/*
  Default constuctor
*/
function Tutorial(settings) {
  this.num =  1;
  this.show = false;
  this.reopen =  false;
  this.timer = null;
}

/**
 * [init using jQuery opens modal]
 * @return {[none]}
 */
Tutorial.prototype.init = function() {
  // Initialize Popover
  $('#tutorial').popover();
};
/*
  Mind that controls tutorials
  @param {int} num
  @param {int} time
  @param {boolean} if it is reopened
*/
Tutorial.prototype.tutorialControl = function(num, time, reclick) {
  tutor = this;
  if ((!this.show || !this.reopen) && num == this.num) {
    if (num === 1) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Click the radar screen to activate the robot arm!");
    };
    if (num === 2) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Click and drag the arm in the radar screen to move the robot's arm!");
    };
    if (num === 3) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.");
    };
    if (num === 4) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Double click the radar screen to collect the part");
    };
    setTimeout(function() {
        $('#tutorial').popover('show');
        tutor.show = true;
        tutor.reopen = false;

      }, time);
    if(!reclick) {
      tutor.setTimer(10000);
      tutor.show = false;
      tutor.reopen = true;
    }
  }
};
/*
  Resets tutorial timer
  @param {}
  @return {}
*/
Tutorial.prototype.clearTimer = function() {
  clearTimeout(this.timer);
};
/*
  Set tutorial timer
  @param {int} time
  @param {tutorial} tutorial
  @returns void
*/
Tutorial.prototype.setTimer = function(time) {
  this.timer = setTimeout(function() {
    $('#tutorial').popover('hide');
  }, time);
};

module.exports = new Tutorial();

},{}],14:[function(require,module,exports){
module.exports = {
	/**
	 * [screenToMath takes screen cooridinates (top-left = (0,0)), bottom-right = (500,500)]
	 * @param  {[type]} x [x value in screen coors]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	screenToMath: function(x,y) {
	  return [(x - 250) * 10 / 250, - (y - 250) * 10 / 250];
	},

	mathToScreen: function(x,y) {
	  return [x * 250 / 10 + 250, - y * 250 / 10 + 250];
	},

	applyInverse: function(x, y, matrix) {
    var determinant = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]),
    		pre = this.screenToMath(x, y),
    	 	prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / determinant,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / determinant,
   		 	pre = this.mathToScreen(prex,prey);
   	return {
   		x: pre[0],
   		y: pre[1]
   	}
	},

	applyMatrix: function(sX,sY,matrix) {
	  // var matrix = matrix || [
		//   [(.8 * Math.cos(30)),(1.2 * Math.cos(50))],
		//   [(.8 * Math.sin(30)),(1.2 * Math.sin(50))]
	  // ];
	  // console.log('matrix ', matrix)
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

	isInRange: function(oX, oY, tX, tY, xb, yb, range) {
  	return (Math.abs(tX - oX) <= range * xb ) && (Math.abs(tY - oY) <= range * yb);
	},

	/**
	 * [isOnScreen validates that a point with a linear transformation applied to it will be visible]
	 * @param  {[type]}  matrix [2D array ]
	 * @param  {[type]}  point  [JS object {x: a, y: b}]
	 * @return {Boolean}        [description]
	 */
	isOnScreen: function(matrix, point) {
		var pre = this.screenToMath(point.x, point.y),
				par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
    		prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / par,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / par;
    pre = this.mathToScreen(prex,prey);
    return (pre[0] >= 0) && (pre[0] <= 500) && (pre[1] >= 0) && (pre[1] <= 500);
	},

	/**
	 * [getValidPreImageCircle generates list of (x,y) pairs that are valid in pre-image and image of a circle]
	 * @return {[int, int]} [list of JS objects with properties x, y]
	 */
	getValidPreImageCircle: function() {
		var validPoints = [],
				angle = Math.random() * Math.PI,
				r = (Math.random() * 4) + 4;

		for( var i = 0; i < 8; i++ ) {
			validPoints.push({
				x: r * Math.cos(angle),
				y: r * Math.sin(angle)
			});
			angle += (Math.PI / 4);
		}
		return validPoints;
	},
	getValidPreImageOval: function(matrix) {
		var validPoints = [],
				angle = Math.random() * Math.PI,
				r = (Math.random() * 3) + 1;

		for( var i = 0; i < 8; i++ ) {
			validPoints.push({
				x: matrix[0][0] * r * Math.cos(angle) + matrix[0][1] * r * Math.sin(angle),
				y: matrix[1][0] * r * Math.cos(angle) + matrix[1][1] * r * Math.sin(angle)
			});
			angle += (Math.PI / 4);
		}
		return validPoints;
	},

	/**
	 * [getValidPreImagePairs generates list of pairs (x,y) that are in a line]
	 * @return {[int, int]} [list of JS objects with properties x, y]
	 */
	getValidPreImagePairs: function() {

		var validPoints = [],
				coefficients = [1.5, 4.5, 7.5],
		 		angle = Math.PI * Math.random(),
		 		tempX = Math.cos(angle),
		 		tempY = Math.sin(angle);

		for( var i = 0; i < coefficients.length; i++ ) {
		 	validPoints.push({
			 	x: (coefficients[i] * tempX),
				y: (coefficients[i] * tempY)
	 		});
		 	validPoints.push({
		 		x: ((-1 * coefficients[i]) * tempX),
		 		y: ((-1 * coefficients[i]) * tempY)
		 	});
		}
		return validPoints;
	}
};

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
