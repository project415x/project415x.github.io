d3.selection.prototype.spinAndBlink = function(){
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
    
    wraith = wraith.transition().attrTween("transform", rotTween).duration(1000)
                  .transition().style("opacity", 0.5).duration(250)
                  .transition().style("opacity", 0.9).duration(250).each("end", repeat);
  })();
  return this;
}