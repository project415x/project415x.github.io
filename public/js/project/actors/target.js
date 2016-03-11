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
	this.width = settings.width || 40;
	this.height = settings.height || 40;
	this.ttl = settings.ttl;
	// No need for color if we use image pattern as fill
	// this.color = settings.color || '#FF0000';
	// test
	this.type = settings.type || "output";
}

Target.prototype.updateColor = function(dist, n) {
		this.color = dist;
		// select specific target
		// change color attribute
}

Target.prototype.init = function() {
		this.drawTarget();
}

Target.prototype.drawTarget = function() {
	var score = 0,
	 		real_x = this.x - this.width / 2,
			real_y = this.y - this.height / 2;
	var rect = d3.select('#'+this.type+'-svg').append("rect")
		.attr({
			"x": real_x,
			"y": real_y,
			"width": this.width,
			"height": this.height
		})
	var tar_num = Math.floor(Math.random() * 19) + 1;
	rect.style({"fill": "url(#tar" + tar_num + ")"});
}

module.exports = Target;
