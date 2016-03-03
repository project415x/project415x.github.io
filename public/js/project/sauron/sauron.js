var util = require('../utilities/math.js'),
		Target = require('../actors/target.js');

function Sauron(setting) {
	this.matrix = [[1,2],[2,1]];
}

Sauron.prototype.applyTransformation = function(sX,sY,matrix){
  var matrix = matrix || [[1,3],[2,0]];
  var math_coord = util.screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return util.mathToScreen(applied_coord[0],applied_coord[1]);  
};

Sauron.prototype.updateInputVector = function(d){
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

Sauron.prototype.updateOutputVector = function(d) {
  var i = this.applyTransformation(d.x,d.y);
  d3.select('#output-vector').remove();
  d3.select('#output-svg').append('path')
    .attr({
      "stroke": "red",
      "stroke-width":"4",
      "d": "M 250 250 L"+i[0]+" "+i[1]+"z",
      "id": 'output-vector'
  });
};

Sauron.prototype.updateTargets = function(d) {
  var x = d3.selectAll("circle").attr("cx"),
      y = d3.selectAll("circle").attr("cy"),
      r = d3.selectAll("circle").attr("r"),
      i = this.applyTransformation(d.x,d.y);
  if (util.isClose(i[0],i[1],x,y,r)) {
    d3.selectAll("circle").remove();
    this.updateProgress();
    this.generateTarget([[1,3],[2,0]]);
  }
};

Sauron.prototype.tellSauron = function(d) {
  this.updateInputVector(d);
  this.updateOutputVector(d);
  this.updateTargets(d);
};

Sauron.prototype.applyTransformation = function(sX,sY,matrix){
  var matrix = matrix || [[1,3],[2,0]];
  var math_coord = util.screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return util.mathToScreen(applied_coord[0],applied_coord[1]);  
};

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

Sauron.prototype.generateTarget = function(matrix) {
  var legal = false,
      par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  var newX, newY;

  while (!legal) {
    newX = util.getRandom(0,500);
    newY = util.getRandom(0,500);
    var pre = util.screenToMath(newX,newY);
    var prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / par,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / par;
    pre = util.mathToScreen(prex,prey);

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