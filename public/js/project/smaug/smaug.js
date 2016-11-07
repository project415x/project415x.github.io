function Smaug(){
	this.robot = null;
}



Smaug.prototype.changeRobot = function(mode, temp, timeout, level){
	level++;
	//delete this:
	level = 4;
	this.checkRobot();
	//d3.select("#")

	//this.robot.style({"fill": "url(#tarrobo"+mode+")"});
	if(temp){
		console.log("here");
		this.robot.transition().style("opacity",
			function() {
				if ( this.id == "robot"+mode ){
					return 1;
				}
				return 0;
			}
		).transition().duration(timeout).style("opacity",
			function() {
				if ( this.id == "robot"+level ){
					return 1;
				}
				return 0;
			}
		);
		setTimeout(function(){
			d3.select("#robot").style({"fill": "url(#tarrobo"+level+")"});
		}, timeout);
	}
};

Smaug.prototype.moveRobot = function(deltaX, deltaY, absolute, moveFunc){
	this.checkRobot();
	moveFunc = moveFunc || function(x, y, obj){
		obj.attr({
			x: x,
			y: y
		});
	};

	var targetX = null;
		targetY = null;
	
	if(absolute){
		targetX = deltaX;
		targetY = deltaY;
	}
	else{
		targetX = deltaX + Number(this.robot.attr("x"));
		targetY = deltaY + Number(this.robot.attr("y"));
	}

	moveFunc(targetX, targetY, this.robot);

};

Smaug.prototype.checkRobot = function () {
	if(d3.selectAll(".robot").size() != 0){
		this.robot = d3.selectAll(".robot");
		console.log("robot exists!");
		return;
	}
}

Smaug.prototype.drawRobot = function(level){
	//console.log(d3.select("#robot").size());
	level = level || 1;
	level++; //start at robo2
	//delete this:
	level = 4;
	var width = Number(d3.select("#output-svg").attr("width")),
		height = Number(d3.select("#output-svg").attr("height"));
	d3.select("#output-svg").append("rect").attr({
			"x": width/2 - 80,
			"y": height/2 - 109/2 - 4,
			"width": "92px",
			"height": "109px",
			"id": "robot"+0,
			"class": "robot"
	})
	.style({
		"fill": "url(#tarrobo"+0+")",
		"opacity": 0
	});
	for(var i = 1; i<5; i++){
		d3.select("#output-svg").append("rect").attr({
				"x": width/2 - 69,
				"y": height/2 - 94/2,
				"width": "69px",
				"height": "94px",
				"id": "robot"+i,
				"class": "robot"
		})
		.style({
			"fill": "url(#tarrobo"+i+")",
			"opacity": 0
		});
	}
	d3.select("#robot"+level).style("opacity", 1);
	console.log("Drew the robot!");
				//.style({"fill": "url(#robo4)"});
};

Smaug.prototype.changeBackground = function(mode){

}

module.exports = Smaug;