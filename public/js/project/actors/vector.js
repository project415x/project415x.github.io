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
	    	"d": this.generatePath(this),
	    	"id": this.type+'-vector',
			})
			.call(this.dragInputVector);
	}
	else {
		console.log("Invalid vector type: ",this.type);
	}
};

// selects vector being dragged
// regenerates input vector path
// updates output vector
Vector.prototype.dragInputVector = function() {
	d3.select('#'+this.type+'-vector')	
};

Vector.prototype.updateVector = function() {
	d3.select('#')
};
/*
* Generates path value based on properties on instance of vector
* param optional
* RETURNS path to be drawn 
*/
Vector.prototype.generatePath = function(vector) {
	return "M"+vector.tail.x+" "+vector.tail.y+" L"+vector.head.x+" "+vector.head.y+" z" ||
		"M"+this.tail.x+" "+this.tail.y+" L"+this.head.x+" "+this.head.y+" z";
};

// TODO
Vector.prototype.drawVectorHead = function(vector) {

};