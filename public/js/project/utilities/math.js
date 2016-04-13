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
