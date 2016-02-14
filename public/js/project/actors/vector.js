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
	this.color = settings.color || "#32abad";
	this.type = settings.type || "input";
}

/*
* INITIALIZES vector on a page
* NO PARAM NO RETURNS
*/
Vector.prototype.init = function() {
	this.drawVector(this.type);
}

/*
* Draws a vector depending on which canvas
* NO PARAMS. NO RETURNS
*/
Vector.prototype.drawVector = function() {
	if(this.type === "input") {
		this.drawInputVector();
	} 
	else if(this.type === "output") {
		this.drawOutputVector();
	}
	else {
		console.log("Invalid vector type: ",this.type);
	}
}

/*
* SELECTS INPUT SVG and DRAWS ontop of it
* ADDS ID TO INPUT VECTOR
*/
Vector.prototype.drawInputVector = function() {
	d3.select("#input-svg")
		.append("path") // vector itself
		.attr({
			"stroke": "red",
    	"stroke-width":3,
    	// "fill": "value" // test this with a graphic?
    	"d": this.generatePath(this),
    	"id": "input_vector"
		});
}

/*
* SELECTS INPUT SVG and DRAWS ontop of it
* ADDS ID TO OUTPUT VECTOR
*/
Vector.prototype.drawOutputVector = function() {
	d3.select("#output-svg")
		.append("path") // vector itself
		.attr({
			"stroke": "red",
    	"stroke-width":3,
    	// "fill": "value" // test this with a graphic?
    	"d": this.generatePath(this),
    	"id": "output_vector"
		});
}

/*
* Generates path value based on properties on instance of vector
* param optional
* RETURNS path to be drawn 
*/
Vector.prototype.generatePath = function(vector) {
	return "M"+vector.tail.x+" "+vector.tail.y+" L"+vector.head.x+" "+vector.head.y+" z" ||
		"M"+this.tail.x+" "+this.tail.y+" L"+this.head.x+" "+this.head.y+" z";
}

// TODO
Vector.prototype.generateVectorHead = function(vector) {

}

// might not be needed as well
Vector.prototype.update = function(x, y) {
		this.x = x;
		this.y = y;
}

// might not be needed
Vector.prototype.copy = function(x,y) {

}