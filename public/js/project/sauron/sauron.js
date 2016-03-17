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
	d3.select("#output-svg").append("rect").attr("x", 245).attr("y", 210).attr("width", 471).attr("height", 30).style("fill", "url(#tararm)")
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
				// Consider exports Joseph's old loadPage function to use here (levelTracking.loadPage())
				//.on("click", loadPage("frameLevel", "1", "0"));
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
