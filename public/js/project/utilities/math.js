module.exports = {

	screenToMath: function(x,y) {
	  return [(x - 250) * 10 / 250, - (y - 250) * 10 / 250];
	},

	mathToScreen: function(x,y) {
	  return [x * 250 / 10 + 250, - y * 250 / 10 + 250];
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
