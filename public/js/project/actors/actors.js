/**
* TARGET CONSTRUCTOR
*
  var settings = {
	x: 2,
	y: 2,
	ttl: 30	
  };
*
*/

function target(settings) {

	this.x = settings.x;
	this.y = settings.y;
	this.ttl = settings.ttl;
	this.color = '#FF0000';

	// also include drawing object
	this.drawingObject = [];

	function update(x,y) {
		this.x = x;
		this.y = y;
	}

	function updateColor(dist) {
		this.color = '#FF0000';
		// TODO: make not dumb
	}
}

function vector(x,y) {

	this.x = x;
	this.y = y;

	this.drawingObject = [];

	function updateVector(x,y) {
		this.x = x;
		this.y = y;
	}

	function copy(x,y) {

	}
}