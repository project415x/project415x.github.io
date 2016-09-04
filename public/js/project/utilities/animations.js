var util = require("../utilities/math.js");

d3.selection.prototype.spinAndBlink = function(self){
  var wraith = this;
  //prevents this function from being called again 
  wraith.style("opacity", 0.9);
  
  (function repeat(){
    //console.log(wraith.attr("id")[0]);
    if (wraith.attr("class") === "clicked" ||  wraith.attr("class") === "dead"){
      return;
    }

    function rotTween() {
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2;
          //console.log(width, height);
      var i = d3.interpolate(0, 360);
        return function(t) {
          return "rotate(" + i(t) + ","+x+","+y+")";
      };
    }

    function getDuration(){
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2,
          matrixPos = util.applyMatrix(self.pos.x,self.pos.y,self.matrix),
          duration = 2000;
      if(util.isInRange(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2, 2)){
        duration /= 2; 
      }
      if(util.isClose(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2)){
        duration /= 2; 
      }
      return duration;
    }
    
    wraith = wraith.transition().attrTween("transform", rotTween).duration(getDuration)
                  .transition().style("opacity", 0.5).duration(250)
                  .transition().style("opacity", 0.9).duration(250).each("end", repeat);
  })();
  return this;
};



d3.transition.prototype.setRotation = function(angle){
  this.attrTween("transform", function(){
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2;
      return function(){
        return "rotate("+angle+","+x+","+y+")";
      };
  });
  return this;  
}
