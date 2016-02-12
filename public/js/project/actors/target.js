/**
* TARGET CONSTRUCTOR
*
  var settings = {
	x: 2,
	y: 2,
	ttl: 30,
	color: ,	
  };
*
*/

function Target(settings) {
	this.x = settings.x;
	this.y = settings.y;
	this.ttl = settings.ttl;
	this.color = '#FF0000';
	this.id;
	// also include drawing object
	// this.drawingObject = [];

}

Target.prototype.update = function(x,y) {
		this.x = x;
		this.y = y;
}

Target.prototype.updateColor = function(dist, n) {
		this.color = dist;
		// select specific target
		// change color attribute
		d3.select("#target_"+n)
			.attr("color",this.color)

}