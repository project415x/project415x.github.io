/**
* TARGET CONSTRUCTOR
*
  var settings = {
	x: 2,
	y: 2,
	ttl: 30,
	color:  ,	
  };
*
*/

function Target(settings) {
	this.x = settings.x || 300;
	this.y = settings.y || 300;
	this.r = settings.r || 15;
	this.ttl = settings.ttl;
	this.color = settings.color || '#FF0000';
	this.type = settings.type || "output";
	this.isScore = settings.isScore || false;
}

Target.prototype.updateColor = function(dist, n) {
		this.color = dist;
		// select specific target
		// change color attribute
}

Target.prototype.init = function() {
	if(this.isScore) {
	}
	else {
		this.drawTarget();
	}
}

Target.prototype.drawTarget = function() {
	var score = 0;
	var circle = d3.select('#'+this.type+'-svg').append("circle")
		.attr({
			"cx": this.x,
			"cy": this.y,
			"r": this.r
		})
		.style({"fill": this.color});
		
	if(this.isScore) {
		circle.append("text")
			.text("Score ")
	}
}