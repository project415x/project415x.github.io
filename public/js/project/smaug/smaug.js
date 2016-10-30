function Smaug(){
	this.robot = null;
}



Smaug.prototype.changeRobot = function(mode){
	this.robot.style({"fill": "url(#tarrobo"+mode+")"});
};

Smaug.prototype.moveRobot = function(deltaX, deltaY, absolute, moveFunc){
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

Smaug.prototype.drawRobot = function(level){
	level = level || 1;
	level++; //start at robo2
	var width = Number(d3.select("#output-svg").attr("width")),
		height = Number(d3.select("#output-svg").attr("height"));
	this.robot = d3.select("#output-svg").append("rect").attr({
			"x": width/2 - 69,
			"y": height/2 - 94/2,
			"width": "69px",
			"height": "94px",
			"id": "robot",
			"class": "robot-sprite"
	})
	.style({"fill": "url(#tarrobo"+level+")"});

	console.log("Drew the robot!");
				//.style({"fill": "url(#robo4)"});
};

Smaug.prototype.changeBackground = function(mode){

}

module.exports = Smaug;