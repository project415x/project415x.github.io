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

	applyInverse: function(x, y, matrix, width) {
    var determinant = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]),
    		pre = this.screenToMath(x, y, width),
    	 	prex = (matrix[1][1] * pre[0] - matrix[0][1] * pre[1]) / determinant,
        prey = (- matrix[1][0] * pre[0] + matrix[0][0] * pre[1]) / determinant,
   		 	pre = this.mathToScreen(prex,prey, width);
   	return {
   		x: pre[0],
   		y: pre[1]
   	}
	},

	applyMatrix: function(sX,sY,matrix, width) {
	  // var matrix = matrix || [
		//   [(.8 * Math.cos(30)),(1.2 * Math.cos(50))],
		//   [(.8 * Math.sin(30)),(1.2 * Math.sin(50))]
	  // ];
	  // console.log('matrix ', matrix)
	  var math_coord = this.screenToMath(sX,sY, width),
	      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
	  return this.mathToScreen(applied_coord[0],applied_coord[1], width);
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

	isOnRadar: function(x, y, matrix, width){
		var point = this.applyInverse(x, y, matrix, width);
		return point.x > 0 && point.x < width && point.y > 0 && point.y < width;

	}
};
