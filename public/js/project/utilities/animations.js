var util = require("../utilities/math.js");

/*
  makes a target spin and blink
  @param {instanceof Sauron}
  @return d3.selection
*/
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

/*
  makes a target blink 
  @param {instanceof Sauron} self
  @param {bool} proximity
  @param (int) duration
  @return d3.selection
*/
d3.selection.prototype.blink = function(self, proximity, duration){
  var wraith = this;
  //prevents this function from being called again 
  wraith.style("opacity", 0.9);
  
  (function repeat(){
    //console.log(wraith.attr("id")[0]);
    if (wraith.attr("class") === "clicked" ||  wraith.attr("class") === "dead"){
      return;
    }

    function getDuration(){
      var wraith = d3.select(this),
          width =  wraith.attr("width"),
          height = wraith.attr("height"),
          x = Number(wraith.attr("x")) + width / 2,
          y = Number(wraith.attr("y")) + height / 2,
          matrixPos = util.applyMatrix(self.pos.x,self.pos.y,self.matrix),
          newDuration = duration;
      if(util.isInRange(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2, 2)){
        newDuration /= 2; 
      }
      if(util.isClose(matrixPos[0], matrixPos[1], x, y, width / 2, height / 2)){
        newDuration /= 2; 
      }
      return newDuration;
    }
    
    wraith = wraith.transition().style("opacity", 0.5).duration(proximity?getDuration:duration)
                  .transition().style("opacity", 0.9).duration(proximity?getDuration:duration).each("end", repeat);
  })();
  return this;
};

/*
  Moves a target in random directions
  @param {float}
  @return d3.selection
*/
d3.selection.prototype.randomlines = function(scaleFactor){
  var wraith = this;
  (function bounce(){
    var newX = util.getRandom(0, 460), newY = util.getRandom(0, 460);
    wraith = wraith.transition().attr("x", newX).attr("y", newY).ease("linear").duration(function(){
      var currX = Number(d3.select(this).attr("x"));
      var currY = Number(d3.select(this).attr("y"));
      var dx = (Number(currX)-newX)*(Number(currX)-newX);
      var dy = (Number(currY)-newY)*(Number(currY)-newY);
      var d = Math.sqrt(dx+dy)*scaleFactor;
      return d;
    }).each("end", bounce);
  })();
};

/*
  Removes all targets within duration+100 ms.
  @param {int}
  @return d3.selection
*/
d3.selection.prototype.slowDeath = function(duration){
  //changes class name to prevent unwanted behaviour
  this.attr("class", "dead").transition().style("opacity",0).duration(duration);
  setTimeout(function() {
    d3.selectAll(".dead").remove();
    }, duration+100);
  return this;
}

/*
  Removes all tatrgets within duration+100 ms.
  @param {int}
  @return d3.selection
*/
d3.selection.prototype.isBorn = function(duration){
  this.transition().style("opacity",1).duration(duration);
    setTimeout(function() {
      d3.selectAll(".new").style("opacity", 1);
    }, duration+100);
  return this;
}

/*
  Cancels all transitions and does nothing for
  duration milliseconds
  @param {int}
  @return d3.selection
*/
d3.selection.prototype.wait = function(duration){
  this.transition().duration(duration);
  return this;
}

/*
  transition to set rotation to angle
  @param {int}
  @return d3.transition
*/
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
