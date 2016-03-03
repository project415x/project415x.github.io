function Sauron(setting) {
	this.matrix = setting.matrix || [[1,2],[2,1]];
}

Sauron.prototype.applyTransformation = function(argument){
	 // body...  
};

Sauron.prototype.updateInputVector = function(){
	 updateVector('input-vector');
};

Sauron.prototype.updateOutputVector = function(){
	 updateVector('output-vector');
};

Sauron.prototype.applyMatrix = function(sX,sY,matrix){
  var matrix = matrix || [[1,3],[2,0]];
  var math_coord = screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return mathToScreen(applied_coord[0],applied_coord[1]);  
};

module.exports = Sauron;