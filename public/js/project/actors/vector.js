function Vector() {

	this.head = {
		x: 5,
		y: 5
	}
	this.tail = {
		x: 100,
		y: 100
	}

	this.drawingObject = [];

}

Vector.prototype.init = function() {
	d3.select("#inputSvg")
		.append("path")
		.attr({
			"stroke": "blue",
    	"stroke-width":3,
    	"d": generatePath(this)
		});
}

function generatePath(vector) {
	return "M"+vector.tail.x+" "+vector.tail.y+" L"+vector.head.x+" "+vector.head.y+" z"
}

Vector.prototype.update = function(canvas, x, y) {
		this.x = x;
		this.y = y;
}

Vector.prototype.copy = function(x,y) {

}