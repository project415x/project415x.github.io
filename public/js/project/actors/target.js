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
	this.id = settings.id || "random";
	this.opacity = settings.opacity || "1";
	this.class = settings.class || "";
	this.type = settings.type || "output";
}
/**
 * [updateColor Not currently in use. In ]
 * @param  {[type]} dist [dist]
 * @return {[none]}      
 */
Target.prototype.updateColor = function(dist) {
		this.color = dist;
};

/**
 * [init draws the first target on the canvas]
 * @return {[none]} 
 */
Target.prototype.init = function() {
		this.drawTarget();
};

/**
 * [drawTarget draws target onto canvas ]
 * @return {[none]} []
 */
Target.prototype.drawTarget = function() {
	var tar_num = Math.floor(Math.random() * 19) + 1,
			score = 0,
	 		real_x = this.x - this.width / 2,
			real_y = this.y - this.height / 2;
	
	var rect = d3.select('#'+this.type+'-svg').append("rect")
		.attr({
			"x": real_x,
			"y": real_y,
			"width": this.width,
			"height": this.height,
			"id": this.id,
			"class": this.class
		})
		.style("opacity", this.opacity);
	rect.style({"fill": "url(#tar" + tar_num + ")"});
	var bar = d3.select('#progressbar');
    var currScore = bar.attr("aria-valuenow");
};


module.exports = Target;