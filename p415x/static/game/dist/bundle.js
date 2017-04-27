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
	this.opacity = settings.opacity || "1";
	this.class = settings.class || "";
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
	var newGroup = d3.select('#'+this.type+'-svg').append("g");
	newGroup.attr("class", this.class);
	newGroup.style("opacity", this.opacity);
	var rect = newGroup.append("rect")
		.attr({
			"x": real_x,
			"y": real_y,
			"width": this.width,
			"height": this.height,
			"id": this.id+"-target",
			"class": this.class+"-target"
		})
		.style("opacity", 0);
	var sprite = newGroup.append("rect")
		.attr({
			"x": real_x,
			"y": real_y,
			"width": this.width,
			"height": this.height,
			"id": this.id+"-sprite",
			"class": this.class+"-sprite"
		});
	sprite.style({"fill": "url(#tar" + tar_num + ")"});

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
    utils = require('../utilities/math.js');

var OverWatcher;

function Canvas(settings, sauron) {
  console.log("hello canvas");
  //input error handling

  // console.log(document.body.offsetWidth/2.5 + "   " + document.body.offsetHeight/1.5);
  OverWatcher = sauron;
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

  this.decrementLevel = document.getElementById("lowerBoundLevel");
  this.incrementLevel = document.getElementById("upperBoundLevel");

  this.decrementLevel.style.visibility = "hidden";
  this.incrementLevel.style.visibility = "hidden";

  var self = this;

  this.decrementLevel.onclick = function(){
    level-= 1;
    if(level == 1){
        self.decrementLevel.style.visibility = "hidden";
    }
    self.incrementLevel.style.visibility = "visible";
    OverWatcher.generateNewTargets("", true);
  }
  this.incrementLevel.onclick = function(){
    level+= 1;
    self.decrementLevel.style.visibility = "visible";
    if(level <= currhigh){
        self.incrementLevel.style.visibility = "hidden";
    }
    OverWatcher.generateNewTargets("", true);
  }

}

// Return modified d3 drag listener
// using this inside of return statement refers to d3, not Canvas
// so, self = this is used to differentiate between canvas object and d3 object.
Canvas.prototype.vectorDrag = function() {
  self = this;
  return d3.behavior.drag()
              .on("dragstart", function (){
                OverWatcher.tellSauron(d3.mouse(this), "drag");
                var newTimer = self.getTimer();
                if (newTimer - self.timer <= 200) {
                  OverWatcher.tellSauron(d3.mouse(this), "dbclick");
                }
                self.timer = newTimer;
              })
              .on("drag", function() {
                OverWatcher.tellSauron(d3.mouse(this), "drag");
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
  if(id=="input"){
    var w = this.pixelWidth,
      h = this.pixelHeight;
    var r = Math.sqrt(2)*w/2;
    w = r;
    h = w;
    var canvas = this.getCanvas(id).append('svg')
                  .attr({
                         id: id+"-svg",
                         width: w,
                         height: h
                       });
    // setting up progress bar based on width
    $("#progress-container").width(w);

  } else{

  var canvas = this.getCanvas(id).append('svg')
                .attr({
                       id: id+"-svg",
                       width: this.pixelWidth,
                       height: this.pixelHeight
                     });
  }
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
                 "xlink:href": "/static/game/public/img/items/glow/target" + i + ".gif"
               });
    }
    var arm = this.getTar("arm");
    arm.append('image')
             .attr({
               "x": "0",
               "y": "0",
               "width": "30px",
               "height": "100px",
               "xlink:href": "/static/game/public/img/robotarm.gif"
             });
    for(i = 2; i<=4; i++){
      var robo = this.getTar("roboglitch"+i);
      robo.append('image')
               .attr({
                 "x": "0",
                 "y": "0",
                 "width": "92px",
                 "height": "109px",
                 "xlink:href": "/static/game/public/img/robo/roboglitch"+i+".gif"
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
                 "xlink:href": "/static/game/public/img/robo/robo"+i+".gif"
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
                "xlink:href": "/static/game/public/img/blip.gif"
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
  /*var container = d3.select('#progress-container');
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
         });*/
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

},{"../sauron/sauron.js":11,"../utilities/math.js":15}],4:[function(require,module,exports){
module.exports = {

	inputCanvasSettings : {
		type: "input",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		//pixelWidth: 500,
		//pixelHeight: 500
	},

	outputCanvasSettings : {
		type: "output",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		//pixelWidth: 500,
		//pixelHeight: 500
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
		Smaug = require('../smaug/smaug.js'),
		Tutorial = require('../tutorial/tutorial.js'),
		config = require('./config.js'),
		graphics = new Smaug(),
		Level1 = new Sauron(config.sauron);

function initLevel1() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings,Level1),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings,Level1);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();
	graphics.drawRobot(1);


	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	Level1.generateRandomLineofDeath(true);
}


// think of this as the main function :)
startLevel1 = function startLevel1() {
	initLevel1();
}

},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3,"../sauron/sauron.js":11,"../smaug/smaug.js":12,"../tutorial/tutorial.js":13,"./config.js":4}],6:[function(require,module,exports){
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
		//pixelWidth: 500,
		//pixelHeight: 500
	},

	outputCanvasSettings : {
		type: "output",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		//pixelWidth: 500,
		//pixelHeight: 500
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
module.exports = {

	inputCanvasSettings : {
		type: "input",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		//pixelWidth: 500,
		//pixelHeight: 500
	},

	outputCanvasSettings : {
		type: "output",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		//pixelWidth: 500,
		//pixelHeight: 500
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

},{}],9:[function(require,module,exports){
function Gollum() {
    state = 0
}
var counter = 0;

var messages = [
                "Keep up the good work!",
                "Those are the parts I'm looking for! Get me some more!",
                "The robot will be functioning in no time at all!",
                "A few more tools like this, and robot will be ready to go!",
                "More progress!!",
                "That wasn't so bad now, was it? Keep it going!",
                ];

function readTextFile(file) {
    var converter = new showdown.Converter();
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                $('#chatbar').append("<div class='messages_sent'>" + converter.makeHtml(allText) + "</div>")
                //alert(allText);
            }
        }
    }
    rawFile.send(null);
}


Gollum.prototype.sendmsg = function(event, command) {
    if(event){
        event.preventDefault();
    }
    showdown.setFlavor('github');

    var chatinput = document.getElementById("btn-input");
    var data = chatinput.value;
    if(command){
        data = command;
    }
    chatinput.value = "";
    if (data === "help") {
        if (state == 0) {
            $('#chatbar').append("<div class='messages_sent'><p>Click the radar screen to activate the robot arm!</p></div>")
            state++;
        } else if (state == 1) {
            $('#chatbar').append("<div class='messages_sent'><p>Click and drag the arm in the radar screen to move the robot's arm!</p></div>")
            state++;
        } else if (state == 2) {
            $('#chatbar').append("<div class='messages_sent'><p>Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.</p></div>")
            state++;
        } else if (state == 3) {
            $('#chatbar').append("<div class='messages_sent'><p>Double click the radar screen to collect the part.</p></div>")
            state++;
        } else if (state == 4) {
            console.log("lol");
            readTextFile("/guide/" + level);
            state++;
        }
        var scroller = document.getElementById("chat-panel");
        scroller.scrollTop = scroller.scrollHeight;
    } else if (data === "clear") {
        document.getElementById('chatbar').innerHTML = "";
        state = 0;
    }
};

Gollum.prototype.addText = function(text){
    $('#chatbar').append("<div class='messages_sent'><p>"+text+"</p></div>")
    state++;
    var scroller = document.getElementById("chat-panel");
    scroller.scrollTop = scroller.scrollHeight;
};

Gollum.prototype.addRandMessage = function(){
    var ind = Math.floor(Math.random() * messages.length);
    this.addText(messages[ind]);
};


module.exports = Gollum;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var util = require('../utilities/math.js'),
    Target = require('../actors/target.js'),
    Tutorial = require('../tutorial/tutorial.js'),
    Smaug = require('../smaug/smaug.js'),
    Gollum = require('../gollum/gollum.js');

// Sauron is alive!
/*
  Default constuctor
  Sample settings object in game1, game2, game3
*/


function Sauron(settings) {
    console.log("Sauron started");
    this.armies = [];
    this.level = settings === {} ? -1 : settings.level;
    this.currhigh = 1;
    this.matrix = [
        [1, 2],
        [2, 1]
    ];
    this.deathToll = 0;
    this.graphics = new Smaug();
    this.chat = new Gollum();
    this.chat_form = document.getElementById("chat_form");
    this.enable = true;
    this.messenger = document.getElementById("mailbox");
    this.btnsOn = 0;
    this.decrementLevel = document.getElementById("lowerBoundLevel");
    this.incrementLevel = document.getElementById("upperBoundLevel");



    var self = this;
    this.timer = setTimeout(function() {
        var x = 0;
        var messageInt = setInterval(function() {
            self.chat.sendmsg(null, "help");
            if (++x === 4) {
                window.clearInterval(messageInt);
            }
        }, 3000);

    }, 10000);

    this.chat_form.onsubmit = function(event) {
        self.chat.sendmsg(event);
    };
}

/*
  Sauron creates a new matrix
  @return int[2][2]
*/
Sauron.prototype.setMatrix = function() {
    var randx = util.getRandom(.75, 1.5);
    var randy = util.getRandom(2, 3);
    var m = [
        [randx, 0],
        [0, randy]
    ];

    var theta = util.getRandom(Math.PI / 2, 3 * Math.PI / 2);

    var rot = [
        [Math.cos(theta), -Math.sin(theta)],
        [Math.sin(theta), Math.cos(theta)]
    ];

    this.matrix = [
        [(rot[0][0] * m[0][0] + rot[0][1] * m[1][0]),
            (rot[0][0] * m[0][1] + rot[0][1] * m[1][1])
        ],
        [(rot[1][0] * m[0][0] + rot[1][1] * m[1][0]),
            (rot[1][0] * m[0][1] + rot[1][1] * m[1][1])
        ]
    ];
};

/*
  Given a matrix and a pair (x,y) of screen coordinates, convert to math coord and applies LT
  Returns LinearTransformationScreen(x,y) coordinates
*/
Sauron.prototype.applyTransformation = function(sX, sY, matrix) {
    var matrix = this.matrix;
    var width = document.getElementById("input-svg").width.baseVal.value;
    var math_coord = util.screenToMath(sX, sY, width),
        applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
    return util.mathToScreen(applied_coord[0], applied_coord[1], width);
};

/*
  Sauron destroys a vector and creates a new one
  @param {OBJECT(int,int)}
  @return void
*/
Sauron.prototype.updateInputVector = function(d) {
    this.removeVector('input');
    //console.log(document.getElementById("input-svg"));
    var width_svg = document.getElementById("input-svg").width.baseVal.value;
    d3.select('#input-svg').append('path')
        .attr({
            "stroke": "#31BA29",
            "stroke-width": "8",
            "d": "M " + width_svg / 2 + " " + width_svg / 2 + " L" + d.x + " " + d.y + "z",
            "id": 'input-vector'
        });
};

/*
  Sauron takes no pitty on a vector and destroys it.
  @param {string} type of vector
  @returns void
*/
Sauron.prototype.removeVector = function(type) {
    d3.select('#' + type + '-vector').remove();
};

/*
  Sauron makes a strategic decicision and modifies a vector
  @param {object(int,int)}
  @return void
*/
Sauron.prototype.updateOutputVector = function(d) {
    var width_svg_i = document.getElementById("input-svg").width.baseVal.value;
    var width_svg_o = document.getElementById("output-svg").width.baseVal.value;
    var i = util.applyMatrix(d.x, d.y, this.matrix, width_svg_i, width_svg_o);
    var width_svg = document.getElementById("output-svg").width.baseVal.value;
    this.removeVector('output');
    var height = Math.sqrt(((width_svg / 2) - i[0]) * ((width_svg / 2) - i[0]) + ((width_svg / 2) - i[1]) * ((width_svg / 2) - i[1]));
    var angle = -1 * Math.atan((i[0] - (width_svg / 2.0)) / (i[1] - (width_svg / 2.0))) * 180.0 / Math.PI;
    if (i[1] > (width_svg / 2)) {
        angle += 180;
    }
    var width = 20;
    var ratio = "none";
    if (height < 300) {
        ratio = "xMinYMin slice";
    }
    if (d3.select('#output-vector').size() === 0) {
        var arm = d3.select('#output-svg').append('image')
            .attr({
                "x": (i[0] - width / 2),
                "y": i[1],
                "width": "" + width + "px",
                "height": "" + height + "px",
                "preserveAspectRatio": ratio,
                "id": 'output-vector',
                "xlink:href": "/static/game/public/img/robotarm.gif",
                "transform": 'rotate(' + angle + ',' + i[0] + ',' + i[1] + ')'
            });
        //arm.style({"fill": "red"});
    } else {
        d3.select('#output-vector')
            .attr({
                "x": (i[0] - width / 2),
                "y": i[1],
                "width": "" + width + "px",
                "height": "" + 100 + "px",
                "preserveAspectRatio": ratio,
                "transform": 'rotate(' + angle + ',' + i[0] + ',' + i[1] + ')'
            });
    }
};

/*
  Sauron gets all of the targets in the output svg
  @returns {d3.selection} of targets
*/
Sauron.prototype.getArmies = function() {
    return d3.select("#output-svg").selectAll('.new-target');
};

/*
  Sauron gets all of the dead targets in the output svg
  @returns {d3.selection} of targets
*/
Sauron.prototype.getFallen = function() {
    return d3.select("#output-svg").selectAll('.clicked');
};

/*
  After good news from the Palantir Sauron moves forces!
  @param {obj(int,int)} d
  @param {string} type
  @returns {}
*/
Sauron.prototype.updateTargets = function(d, type) {
    var list = this.getArmies();
    var width_svg_i = document.getElementById("input-svg").width.baseVal.value;
    var width_svg_o = document.getElementById("output-svg").width.baseVal.value;
    var i = util.applyMatrix(d.x, d.y, this.matrix, width_svg_i, width_svg_o);
    width_svg = document.getElementById("output-svg").width.baseVal.value;
    var self = this;
    //if (list.style("opacity")<1){
    //  console.log("Done");
    //  return;
    //}
    list.each(function() {
        var wraith = d3.select(this),
            id = wraith.attr("id"),
            width = Number(wraith.attr("width")),
            height = Number(wraith.attr("height")),
            x = Number(wraith.attr("x")) + width / 2,
            y = Number(wraith.attr("y")) + height / 2;
        //console.log(id);
        if (util.isClose(i[0], i[1], x, y, width / 2, height / 2)) {
            if (wraith.sprite().style("opacity") > 0.9)
                wraith.sprite().jump(10, 250);
            if (type === "collision") {
                clearTimeout(self.timer);
                console.log(self.matrix);
                wraith.sprite().transition();

                d3.select(wraith.node().parentNode).attr("class", "clicked");

                wraith.setClicked();
                wraith.sprite().transition().attr("y", wraith.attr("y")).style("opacity", 0.4).duration(250);

                var total = self.getArmies().size() + self.getFallen().size();
/*                var prog_increment = $("#progress-container").width() / (total * 3);
                var prog_width = $("#progress-anim").width();
                $("#progress-anim").width(Number(prog_width) + prog_increment);
                console.log($("#progress-anim").width());*/
                self.deathToll++;

                //self.updateProgress();
                self.drawBlips(x, y);

                if (self.getArmies().size() === 0) {
                    if ((level_changed + 1) % 3) {
                        self.chat.addRandMessage();
                    }
                    self.generateNewTargets(id, false, level);
                }
            }
        } else {
            wraith.sprite().transition().style("opacity", 1).attr("y", wraith.attr("y"));
        }
    });
};

/*

  @param {} none
  @returns {} int
*/
Sauron.prototype.checkNumberOfBlips = function() {
    return d3.selectAll(".blips").size();
};

Sauron.prototype.removeBlips = function(level) {
    var self = this;
    this.deathToll = 0;
    d3.selectAll(".clicked-target").remove();
    d3.selectAll(".clicked-sprite").transition().style("opacity", 1).duration(100);
    d3.selectAll(".clicked, .blips").slowDeath(2000);
    this.enable = false;
    setTimeout(function() {
        self.graphics.changeRobot(0, true, 2000, level);
    }, 2001);
    setTimeout(function() {
        d3.selectAll(".clicked").remove()
        d3.selectAll(".new").isBorn(500);
        self.enable = true;
    }, 4001);
};

/*
  Depending on level, logic to draw new targets
  @param {string} id , of dom element related to target
  @returns {}
*/
Sauron.prototype.generateNewTargets = function(id, external) {
    if (!external) {
        if (level != 3) {
            level_changed++;
            level_changed %= 3;
            if (!level_changed) {
                this.chat.addText("Congrats! You have completed Level " + level + "!");
                level++;
                this.decrementLevel.style.visibility = "visible";
                if (level > currhigh) {
                    currhigh = level;
                }

                //reset progress bar
                /*$("#progress-anim").width(0);*/
            }

        }
    } else {
        d3.selectAll(".new").remove();
        level_changed = 0;
    }
    this.removeBlips(level);
    console.log("genhere");
    if (level == 3) {
        var flag = false;
        if (this.checkNumberOfBlips() >= 5) {
            this.setMatrix();
            flag = true;
        }
        this.generateTarget(!flag);
    } else if (level == 1) {
        this.setMatrix();
        this.generateRandomLineofDeath();
    } else if (level == 2) {
        console.log(this.matrix);
        this.setMatrix();
        console.log(this.matrix);
        this.generateRandomCircleofDeath();
    }
};
/*
  Palantir reveals new plans to Sauron
  What do to when an event is registered on the input canvas
  @param {d3 event} event
  @param {string} type
  @return {}
*/
Sauron.prototype.tellSauron = function(event, type) {
    var d = this.convertMouseToCoord(event);
    if (!this.enable) {
        this.updateInputVector(d);
        this.updateOutputVector(d);
        return;
    }
    if (type === "drag") {
        this.updateInputVector(d);
        this.updateOutputVector(d);
        this.updateTargets(d, "detection");
    } else if (type === "dbclick") {
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
    } else {
        if (this.level <= 1) {
            currScore = Number(currScore) + 100 / 20;
        } else {
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
Sauron.prototype.generateTarget = function(firstRun) {
    var initialOpacity = firstRun ? 1 : 0;
    var isValidCoordinate = false,
        matrix = this.matrix,
        par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
        newX, newY;

    //while (!isValidCoordinate) {
    var i_width = document.getElementById("input-svg").width.baseVal.value;
    var o_width = document.getElementById("input-svg").width.baseVal.value;
    var point = {
        x: util.getRandom(10, o_width - 10),
        y: util.getRandom(10, o_width - 10)
    };
    //point = util.applyInverse(point.x, point.y, matrix, i_width, o_width);
    var targetSettings = {
        x: point.x,
        y: point.y,
        width: 40,
        height: 40,
        color: "black",
        id: "random_" + this.deathToll,
        class: "new",
        opacity: "" + initialOpacity
    };
    this.drawTarget(targetSettings);
    /*sleep(1);*/
    //}
};
/*
  Draws blips that are dropped onto input svg
  @param {int} x
  @param {int} y
  @returns void
*/
Sauron.prototype.drawBlips = function(x, y) {
    console.log("drawing blips");
    var width_svg_i = document.getElementById("input-svg").width.baseVal.value;
    var width_svg_o = document.getElementById("output-svg").width.baseVal.value;
    var point = util.applyInverse(x, y, this.matrix, width_svg_o, width_svg_i);
    d3.select("#input-svg").append("circle")
        .attr({
            cx: point.x,
            cy: point.y,
            r: 20,
        })
        .attr("class", "blips")
        .style({
            "fill": "url(#tarblip)"
        });
    console.log("done drawing blips");
};
/*
  Draws random circle of targets onto output svg
  @params {}
  @returns {}
*/
Sauron.prototype.generateRandomCircleofDeath = function(firstRun) {
    var initialOpacity = firstRun ? 1 : 0;
    var validPoints = util.getValidPreImageOval(this.matrix),
        i = 0;
    for (var key in validPoints) {
        var width = document.getElementById("output-svg").width.baseVal.value;
        var pair = validPoints[key],
            screenCoors = util.mathToScreen(pair.x, pair.y, width);


        var targetSetting = {
            x: screenCoors[0],
            y: screenCoors[1],
            width: 40,
            height: 40,
            color: "black",
            id: "circle_" + i,
            class: "new",
            opacity: "" + initialOpacity
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
Sauron.prototype.generateRandomLineofDeath = function(firstRun) {
    var initialOpacity = firstRun ? 1 : 0;
    var validPoints = util.getValidPreImagePairs(),
        i = 0;

    for (var key in validPoints) {
        var width = document.getElementById("output-svg").width.baseVal.value;
        //console.log(width);
        var pair = validPoints[key],
            screenCoors = util.mathToScreen(pair.x, pair.y, width);
        //console.log(validPoints[key]);
        //console.log(screenCoors);
        var targetSetting = {
            x: screenCoors[0],
            y: screenCoors[1],
            width: 40,
            height: 40,
            color: "black",
            id: "line_" + i,
            class: "new",
            opacity: "" + initialOpacity
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
},{"../actors/target.js":1,"../gollum/gollum.js":9,"../smaug/smaug.js":12,"../tutorial/tutorial.js":13,"../utilities/math.js":15}],12:[function(require,module,exports){
function Smaug(){
	this.robot = null;
}



Smaug.prototype.changeRobot = function(mode, temp, timeout, level){
	level++;
	//delete this:
	//level = 4;
	this.checkRobot();
	//d3.select("#")

	//this.robot.style({"fill": "url(#tarrobo"+mode+")"});
	if(temp){
		//console.log("here");
		this.robot.transition().style("opacity",
			function() {
				if ( this.id == "robotglitch"+level ){
					return 1;
				}
				return 0;
			}
		).transition().duration(timeout).transition().style("opacity",
			function() {
				if ( this.id == "robot"+level ){
					return 1;
				}
				return 0;
			}
		).duration(0);
		setTimeout(function(){
			d3.select("#robot").style({"fill": "url(#tarrobo"+level+")"});
		}, timeout);
	}
	else{
		d3.select("#robot").style({"fill": "url(#tarrobo"+level+")"});
	}
};

Smaug.prototype.moveRobot = function(deltaX, deltaY, absolute, moveFunc){
	this.checkRobot();
	moveFunc = moveFunc || function(x, y, obj){
		obj.attr({
			x: x,
			y: y
		});
	};

	var targetX = null;
		targetY = null;
	
	if(absolute){
		targetX = deltaX;
		targetY = deltaY;
	}
	else{
		targetX = deltaX + Number(this.robot.attr("x"));
		targetY = deltaY + Number(this.robot.attr("y"));
	}

	moveFunc(targetX, targetY, this.robot);

};

Smaug.prototype.checkRobot = function () {
	if(d3.selectAll(".robot").size() != 0){
		this.robot = d3.selectAll(".robot");
		console.log("robot exists!");
		return;
	}
}

Smaug.prototype.drawRobot = function(level){
	//console.log(d3.select("#robot").size());
	level = level || 1;
	level++; //start at robo2
	//delete this:
	//level = 4;
	var width = Number(d3.select("#output-svg").attr("width")),
		height = Number(d3.select("#output-svg").attr("height"));
	for(var i = 2; i<=4; i++){
		d3.select("#output-svg").append("rect").attr({
				"x": width/2 - 80,
				"y": height/2 - 109/2 - 4,
				"width": "92px",
				"height": "109px",
				"id": "robotglitch"+i,
				"class": "robot"
		})
		.style({
			"fill": "url(#tarroboglitch"+i+")",
			"opacity": 0
		});
	}
	for(var i = 1; i<5; i++){
		d3.select("#output-svg").append("rect").attr({
				"x": width/2 - 69,
				"y": height/2 - 94/2,
				"width": "69px",
				"height": "94px",
				"id": "robot"+i,
				"class": "robot"
		})
		.style({
			"fill": "url(#tarrobo"+i+")",
			"opacity": 0
		});
	}
	d3.select("#robot"+level).style("opacity", 1);
	console.log("Drew the robot!");
				//.style({"fill": "url(#robo4)"});
};

Smaug.prototype.changeBackground = function(mode){

}

module.exports = Smaug;
},{}],13:[function(require,module,exports){
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
Tutorial.prototype.tutorialControl = function(time) {
  var tutor = this;
  console.log("called tutorialControl "+tutor.num);
  if (!this.show || !this.reopen) {
    if (tutor.num === 1) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Click the radar screen to activate the robot arm!");
    } else if (tutor.num === 2) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Click and drag the arm in the radar screen to move the robot's arm!");
    } else if (tutor.num === 3) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.");
    } else if (tutor.num === 4) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Double click the radar screen to collect the part");
    } else {
      tutor.show = false;
      $('#tutorial').popover('hide');
      return;
    }

    //setTimeout(function() {
    $('#tutorial').popover('show');
    tutor.show = true;
    tutor.reopen = false;
    console.log("asdf");

    //  }, 0);
    setTimeout(function() {

      console.log("timer done "+tutor.num);
      tutor.tutorialControl(time, false);
    }, time);

    //if(!reclick) {
    //  tutor.setTimer(10000);
    //  tutor.show = false;
    //  tutor.reopen = true;
    //}
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
var util = require("../utilities/math.js");

/*
  makes a target spin and blink
  @param {instanceof Sauron}
  @return d3.selection
*/
d3.selection.prototype.spinAndBlink = function(self){
  var wraith = this;
  //prevents this function from being called again 
  wraith.style("opacity", 0.9);
  
  (function repeat(){
    //console.log(wraith.attr("id")[0]);
    if (wraith.attr("class") === "clicked" ||  wraith.attr("class") === "dead"){
      return;
    }

    function rotTween() {
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2;
          //console.log(width, height);
      var i = d3.interpolate(0, 360);
        return function(t) {
          return "rotate(" + i(t) + ","+x+","+y+")";
      };
    }

    function getDuration(){
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2,
          matrixPos = util.applyMatrix(self.pos.x,self.pos.y,self.matrix),
          duration = 2000;
      if(util.isInRange(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2, 2)){
        duration /= 2; 
      }
      if(util.isClose(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2)){
        duration /= 2; 
      }
      return duration;
    }
    
    wraith = wraith.transition().attrTween("transform", rotTween).duration(getDuration)
                  .transition().style("opacity", 0.5).duration(250)
                  .transition().style("opacity", 0.9).duration(250).each("end", repeat);
  })();
  return this;
};

/*
  makes a target blink 
  @param {instanceof Sauron} self
  @param {bool} proximity
  @param (int) duration
  @return d3.selection
*/
d3.selection.prototype.blink = function(self, proximity, duration){
  var wraith = this;
  //prevents this function from being called again 
  wraith.style("opacity", 0.9);
  
  (function repeat(){
    //console.log(wraith.attr("id")[0]);
    if (wraith.attr("class") === "clicked" ||  wraith.attr("class") === "dead"){
      return;
    }

    function getDuration(){
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2,
          matrixPos = util.applyMatrix(self.pos.x,self.pos.y,self.matrix),
          newDuration = duration;
      if(util.isInRange(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2, 2)){
        newDuration /= 2; 
      }
      if(util.isClose(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2)){
        newDuration /= 2; 
      }
      return newDuration;
    }
    
    wraith = wraith.transition().style("opacity", 0.5).duration(proximity?getDuration:duration)
                  .transition().style("opacity", 0.9).duration(proximity?getDuration:duration).each("end", repeat);
  })();
  return this;
};

d3.selection.prototype.jump = function(distance, duration){
  var wraith = this;
  //prevents this function from being called again 
  wraith.style("opacity", 0.9);
  var initY = wraith.attr("y");
  
  (function repeat(){
    //console.log(wraith.attr("id")[0]);
    //var wraith = this;
    var className = wraith.node().className.baseVal;
    //console.log(className === "clicked-sprite");
    if (className === "clicked-sprite" ||  className === "dead"){
      return;
    }
    
    wraith = wraith.transition().attr("y", Number(initY)+distance).duration(duration)
                  .transition().attr("y", Number(initY)-distance).duration(duration) 
                  .each("end", repeat);
  })();
  return this;
};

/*
  Moves a target in random directions
  @param {float}
  @return d3.selection
*/
d3.selection.prototype.randomlines = function(scaleFactor){
  var wraith = this; 
  (function bounce(){
    var newX = util.getRandom(0, 460), newY = util.getRandom(0, 460);
    wraith = wraith.transition().attr("x", newX).attr("y", newY).ease("linear").duration(function(){
      var currX = Number(d3.select(this).attr("x"));
      var currY = Number(d3.select(this).attr("y"));
      var dx = (Number(currX)-newX)*(Number(currX)-newX);
      var dy = (Number(currY)-newY)*(Number(currY)-newY);
      var d = Math.sqrt(dx+dy)*scaleFactor;
      return d;
    }).each("end", bounce);
  })();
};

/*
  Removes all targets within duration+100 ms.
  @param {int}
  @return d3.selection
*/
d3.selection.prototype.slowDeath = function(duration){
  //changes class name to prevent unwanted behaviour
  this.attr("class", "dead").transition().style("opacity",0).duration(duration);
  setTimeout(function() {
    d3.selectAll(".dead").remove();
    }, duration+100);
  return this;
}

/*
  Removes all tatrgets within duration+100 ms.
  @param {int}
  @return d3.selection
*/
d3.selection.prototype.isBorn = function(duration){
  this.transition().style("opacity",1).duration(duration);
    setTimeout(function() {
      //console.log("timeout");
      d3.select(this).style("opacity", 1);
    }, duration+100);
  return this;
}

/*
  Cancels all transitions and does nothing for
  duration milliseconds
  @param {int}
  @return d3.selection
*/
d3.selection.prototype.wait = function(duration){
  this.transition().duration(duration);
  return this;
}

/*
  transition to set rotation to angle
  @param {int}
  @return d3.transition
*/
d3.transition.prototype.setRotation = function(angle){
  this.attrTween("transform", function(){
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2;
      return function(){
        return "rotate("+angle+","+x+","+y+")";
      };
  });
  return this;  
}

d3.selection.prototype.setClicked = function(){
  var wraith = this,
  id = wraith.attr("id"),
  baseid = id.split("-")[0];

  var sprite = d3.select("#"+baseid+"-sprite");

  sprite.attr("class", "clicked-sprite");
  wraith.attr("class", "clicked-target");
}

d3.selection.prototype.sprite = function(){

  var wraith = this;
  var id = wraith.attr("id");
  //console.log(id);
  var baseid = id.split("-")[0];

  var sprite = d3.select("#"+baseid+"-sprite");
  //console.log(baseid);
  return sprite;
}


d3.selection.prototype.animateSprite = function(){
  var wraith = this;
  return wraith.sprite().transition();
}
},{"../utilities/math.js":15}],15:[function(require,module,exports){
module.exports = {
	/**
	 * [screenToMath takes screen cooridinates (top-left = (0,0)), bottom-right = (width,width)]
	 * @param  {[type]} x [x value in screen coors]
	 * @param  {[type]} y [y value in screen coors]
	 * @param  {[type]} width [width and height of sceen]
	 * @return {[type]}   [description]
	 */
	screenToMath: function(x,y, width) {
	  return [(x - width/2) * 10 / (width/2), - (y - (width/2)) * 10 / (width/2)];
	},

	mathToScreen: function(x,y, width) {
	  return [x * (width/2) / 10 + (width/2), - y * (width/2) / 10 + (width/2)];
	},

	applyInverse: function(x, y, matrix, inputWidth, outputWidth) {
    var determinant = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]),
    		pre = this.screenToMath(x, y, inputWidth),
    	 	prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / determinant,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / determinant,
   		 	pre = this.mathToScreen(prex,prey, outputWidth);
   	return {
   		x: pre[0],
   		y: pre[1]
   	}
	},

	applyMatrix: function(sX,sY,matrix, inputWidth, outputWidth) {
	  // var matrix = matrix || [
		//   [(.8 * Math.cos(30)),(1.2 * Math.cos(50))],
		//   [(.8 * Math.sin(30)),(1.2 * Math.sin(50))]
	  // ];
	  // console.log('matrix ', matrix)
	  var math_coord = this.screenToMath(sX,sY, inputWidth),
	      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
	  return this.mathToScreen(applied_coord[0],applied_coord[1], outputWidth);
	},

	getRandom: function(min,max) {
	  return Math.random() * (max - min) + min;
	},

	isClose: function(oX, oY, tX, tY, xb, yb) {
  	return (Math.abs(tX - oX) <= xb ) && (Math.abs(tY - oY) <= yb);
	},

	/**
	 * [isOnScreen validates that a point with a linear transformation applied to it will be visible]
	 * @param  {[type]}  matrix [2D array ]
	 * @param  {[type]}  point  [JS object {x: a, y: b}]
	 * @param  {[type]}  width  [width/height of screens]
	 * @return {Boolean}        [description]
	 */
	isOnScreen: function(matrix, point, width) {
		var pre = this.screenToMath(point.x, point.y, width),
				par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
    		prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / par,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / par;
    pre = this.mathToScreen(prex,prey, width);
    return (pre[0] >= 0) && (pre[0] <= width) && (pre[1] >= 0) && (pre[1] <= width);
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
	},

	isOnRadar: function(matrix, point, i_width, o_width){
		var point = this.applyInverse(point.x, point.y, matrix, i_width, o_width);
		return point.x > 0 && point.x < o_width && point.y > 0 && point.y < o_width;

	}
};

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
