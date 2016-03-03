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
	this.r = settings.r || 15;
	this.ttl = settings.ttl;
	// No need for color if we use image pattern as fill
	// this.color = settings.color || '#FF0000';
	// test
	this.type = settings.type || "output";
	this.isScore = settings.isScore || false;
}

Target.prototype.updateColor = function(dist, n) {
		this.color = dist;
		// select specific target
		// change color attribute
}

Target.prototype.init = function() {
	if(this.isScore) {
	}
	else {
		this.drawTarget();
	}
}

Target.prototype.drawTarget = function() {
	var score = 0;
	var circle = d3.select('#'+this.type+'-svg').append("circle")
		.attr({
			"cx": this.x,
			"cy": this.y,
			"r": this.r
		})
	var tar_num = Math.floor(Math.random() * 10) + 1;
	circle.style({"fill": "url(#tar" + tar_num + ")"});

	if(this.isScore) {
		circle.append("text")
			.text("Score ")
	}
}

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
// Really the vector shouldn't know about its screen coordinates. These should be math coordinates. When we draw this vector to the canvas, the canvas should tell the vector how its math coordinates translate into screen coordinates, *for that canvas*.
function Vector(settings) {
	this.head = {
		x: settings.head.x || 150,
		y: settings.head.y || 150
	};
	// we don't want to move the tail from the origin
	this.tail = {
		x: settings.tail.x || 250,
		y: settings.tail.y || 250
	}
	this.color = settings.color || "red";
	this.type = settings.type || "input";
	this.stroke = settings.stroke || 5;
};

/*
* INITIALIZES vector on a page
* NO PARAM NO RETURNS
*/
Vector.prototype.init = function() {
	this.drawVector(this.type);
};

/*
var drag = d3.behavior.drag()
		.on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);

function dragstart(d,i) {
	console.log('drag start');
}
function dragmove(d) {
	console.log('dragging');
}

function dragend(d) {
	console.log('end of drag')
}
*/

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

// selects vector being dragged
// regenerates input vector path
// updates output vector
Vector.prototype.dragInputVector = function(){
};

Vector.prototype.updateVector = function() {
	return "M 250 250 L"+d.x+" "+d.y+" z"
};
/*
* Generates path value based on properties on instance of vector
* param optional
* RETURNS path to be drawn
*/
Vector.prototype.generatePath = function() {
	return "M"+this.tail.x+" "+this.tail.y+" L"+this.head.x+" "+this.head.y+" z";
};

// TODO
Vector.prototype.drawVectorHead = function(vector) {

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
// import vector.js
var Vector = require('../actors/vector.js'),
    Target = require('../actors/target.js');

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

Canvas.prototype.loadArts = function() {
  if(this.type === "output") {
    // Define defs to store target image pattern
    // Maybe figure out a better place for this code later
    var defs = d3.select('#'+this.type+'-svg').append('defs')
                              .attr("id", "art-defs");
    for (i = 1; i <= 10; i++) {
      defs.append('pattern')
          .attr({
            "id": "tar" + i,
            "x": "0",
            "y": "0",
            "height": "40",
            "width": "40"
          });
      d3.select('#tar' + i).append('image')
                           .attr({
                             "x": "0",
                             "y": "0",
                             "width": "40",
                             "height": "40",
                             "xlink:href": "../public/img/items/target" + i + ".gif"
                           });
    }
    defs.append('pattern')
        .attr({
          "id": "arm",
          "x": "0",
          "y": "0",
          "height": "100%",
          "width": "100%"
        });
    d3.select('#tar' + i).append('image')
                         .attr({
                           "x": "0",
                           "y": "0",
                           "width": "20",
                           "height": "20",
                           "xlink:href": "../public/img/robotarm.gif"
                         });
  }
}

function updateInputVector(d){
// redraw input vector
  d3.select('#input-vector').remove();
  d3.select('#input-svg').append('path')
    .attr({
      "stroke": "red",
      "stroke-width":"5",
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

module.exports = Canvas;

},{"../actors/target.js":1,"../actors/vector.js":2}],4:[function(require,module,exports){
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
// TODO:
// Migrate this to an external config.json
// so we can to something like
// var inputCanvas = Canvas(config.inputCanvas);
// ISOMORPHIC!!!

var inputCanvasSettings = {
	type: "input",
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	pixelWidth: 500,
	pixelHeight: 500
};

var outputCanvasSettings = {
	type: "output",
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	pixelWidth: 500,
	pixelHeight: 500
};

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

var outputVectorSettings = {
	type: "output",
	tail: {
		x: 250,
		y: 250
	},
	head: {
		x: 150,
		y: 100
	}
}

var targetSettings = {
	x: 355,
	y: 50,
	r: 20,
	color: "black",
	isScore: false
};

var scoreSettings = {
	x: 100,
	y: 100,
	r: 40,
	color: "green",
	isScore: true
}

var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js');

function initPlayground() {
	// Create objects needed for game
	var inputCanvas = new Canvas(inputCanvasSettings),
			inputVector = new Vector(inputVectorSettings),
			outputVector = new Vector(outputVectorSettings),
			outputCanvas = new Canvas(outputCanvasSettings),
			outputTarget = new Target(targetSettings),
			scoreTarget = new Target(scoreSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();
	// load arts we need and store them into defs
	outputCanvas.loadArts();

	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	outputTarget.init()
	scoreTarget.init();


}

function startPlayground() {
	initPlayground();
}

// think of this as the main function :)
startPlayground();

},{"../actors/target.js":1,"../actors/vector.js":2,"../canvas/canvas.js":3}],7:[function(require,module,exports){
function applyMatrix(x, y, matrix) {
  var matrixApplied = [matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y];

  return matrixApplied;
}

/**
 * getRandomArbitrary
 * @description: Returns a random number between min (inclusive) and max (exclusive)
 * @param: min, max numbers in range
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * getRandomInt
 * @description: Returns a random integer between min (inclusive) and max (inclusive) Using Math.round() will give you a non-uniform distribution!
 * @param: min, max numbers in range
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{}]},{},[1,2,3,4,5,6,7]);
