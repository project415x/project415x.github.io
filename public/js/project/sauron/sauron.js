require('../utilities/animations.js');
var util = require('../utilities/math.js'),
    Target = require('../actors/target.js'),
    Tutorial = require('../tutorial/tutorial.js');
// Sauron is alive!
/*
  Default constuctor
  Sample settings object in game1, game2, game3
*/
function Sauron(settings) {
  this.matrix = [[1,2],[2,1]];
  this.armies = [];
  this.level = settings === {} ? -1 : settings.level;
  this.deathToll = 0;
  this.pos ={x:0, y:0};
}

/*
  Given a matrix and a pair (x,y) of screen coordinates, convert to math coord and applies LT
  Returns LinearTransformationScreen(x,y) coordinates
*/
Sauron.prototype.applyTransformation = function(sX,sY,matrix){
  var matrix = this.matrix;
  var math_coord = util.screenToMath(sX,sY),
      applied_coord = [matrix[0][0] * math_coord[0] + matrix[0][1] * math_coord[1], matrix[1][0] * math_coord[0] + matrix[1][1] * math_coord[1]];
  return util.mathToScreen(applied_coord[0],applied_coord[1]);
};

/*
  Sauron destroys a vector and creates a new one
  @param {OBJECT(int,int)}
  @return void
*/
Sauron.prototype.updateInputVector = function(d) {
  this.removeVector('input');
  d3.select('#input-svg').append('path')
    .attr({
      "stroke": "#31BA29",
      "stroke-width":"8",
      "d": "M 250 250 L"+d.x+" "+d.y+"z",
      "id": 'input-vector'
  });
};

/*
  Sauron takes no pitty on a vector and destroys it.
  @param {string} type of vector
  @returns void
*/
Sauron.prototype.removeVector = function(type) {
  d3.select('#'+type+'-vector').remove();
};

/*
  Sauron makes a strategic decicision and modifies a vector
  @param {object(int,int)}
  @return void
*/
Sauron.prototype.updateOutputVector = function(d) {
  var i = util.applyMatrix(d.x, d.y, this.matrix);
  this.removeVector('output');
  d3.select('#output-svg').append('path')
    .attr({
      "stroke": "#92989F",
      "stroke-width":"9",
      "d": "M 250 250 L"+i[0]+" "+i[1]+"z",
      "id": 'output-vector'
  });
};

/*
  Sauron gets all of the targes in the output svg
  @returns {array} of dom nodes
*/
Sauron.prototype.getArmies = function() {
  return d3.select("#output-svg").selectAll('rect')[0];
};

/*
  After good news from the Palantir Sauron moves forces!
  @param {obj(int,int)} d
  @param {string} type
  @returns {}
*/
Sauron.prototype.updateTargets = function(d, type) {
  if(d3.select("#movingTarget").size()!=0){
    var i = util.applyMatrix(d.x,d.y,this.matrix);
    var wraith = d3.select("#movingTarget"),
        width = Number(wraith.attr("width")),
        height = Number(wraith.attr("height")),
        x = Number(wraith.attr("x")) + width / 2,
        y = Number(wraith.attr("y")) + height / 2;
    console.log("HERE"+wraith.style("opacity")+" "+i);
    console.log(x+" "+y);

    if (util.isInRange(i[0], i[1], x, y, width / 2, height / 2, 4)) {
      console.log("I'm in");
      if(wraith.style("opacity")==1){
        console.log("asdf");
        wraith.style("opacity", 0.9);
        (function bounce(){
          var newX = util.getRandom(0, 460), newY = util.getRandom(0, 460);
          d3.select("#movingTarget").wait(500).transition().attr("x", newX).attr("y", newY).ease("linear").duration(function(){
            var currX = Number(d3.select(this).attr("x"));
            var currY = Number(d3.select(this).attr("y"));
            var dx = (Number(currX)-newX)*(Number(currX)-newX);
            var dy = (Number(currY)-newY)*(Number(currY)-newY);
            var d = Math.sqrt(dx+dy)*5000/460;
            return d;
          }).each("end", bounce);
        })();
      }
      else{
        if(wraith.style("opacity")!=0.9){
          wraith.style("opacity",0.9);
        }
      }
    }
    else{
      if(wraith.style("opacity")!=1){
        console.log("opacity"+wraith.style("opacity"));
        console.log("REKT");
        if(wraith.style("opacity")!=0.5)
          wraith.style("opacity", 0.5);
      }
    }
    return;
  }
  var list = this.getArmies();
  var i = util.applyMatrix(d.x,d.y,this.matrix);
  for ( elem in list ) {
    if(list[elem].id === "output-svg" ) {
      continue;
    }
    var id = list[elem].id,
        wraith = d3.select("#"+id),
        width = Number(wraith.attr("width")),
        height = Number(wraith.attr("height")),
        x = Number(wraith.attr("x")) + width / 2,
        y = Number(wraith.attr("y")) + height / 2;
    if (wraith.attr("class") === "clicked" || wraith.attr("class") === "dead"){
      continue;
    }
    if (util.isInRange(i[0], i[1], x, y, width / 2, height / 2, 4)) {
      if (wraith.style("opacity")==1){
        var self = this;
        wraith.spinAndBlink(self);
     }       
    }
    else{
      wraith.transition().style("opacity", 1).setRotation(0);
    }
    // collison detection occurs here
    if (util.isClose(i[0], i[1], x, y, width / 2, height / 2)) {
      if (type === "collision") {

        wraith.attr("class", "clicked");
        wraith.transition().style("opacity", 0.4).setRotation(0).duration(250);
        this.deathToll++;

        this.updateProgress();
        this.drawBlips(x,y);

        if( list.length - d3.selectAll(".clicked").size() === 0 ) {
          this.generateNewTargets(id);
        }

      }
      else if (type === "detection") {
        Tutorial.tutorialControl(4,1);
      }
    }
  }
};  

/*

  @param {} none
  @returns {} int
*/
Sauron.prototype.checkNumberOfBlips = function() {
  return d3.select("#input-svg").selectAll("circle")[0].length;
};

Sauron.prototype.removeBlips = function(generator) {
  this.deathToll = 0; 
  d3.selectAll(".clicked, .blips").slowDeath(2000);
  d3.selectAll(".new").isBorn(2000);
};


/*
  Depending on level, logic to draw new targets
  @param {string} id , of dom element related to target
  @returns {}
*/
Sauron.prototype.generateNewTargets = function(id) {
  if (id.indexOf("random") !== -1) {
   if(this.checkNumberOfBlips() >= 5) {
      this.deathToll = 0;
      this.removeBlips();
      this.generateTarget();
    }
    else
      this.generateTarget(true);
  }
  else if (id.indexOf("line") !== -1) {
    this.removeBlips("line");
    this.generateRandomLineofDeath();
  }
  else if (id.indexOf("circle") !== -1) {
    this.removeBlips("circle");
    this.generateRandomCircleofDeath();
  }
}

/*
  Palantir reveals new plans to Sauron
  What do to when an event is registered on the input canvas
  @param {d3 event} event
  @param {string} type
  @return {}
*/
Sauron.prototype.tellSauron = function(event, type) {
  this.convertMouseToCoord(event);
  var d = this.pos;
  if (type === "drag") {
    this.updateInputVector(d);
    this.updateOutputVector(d);
    if (!Tutorial.show || !Tutorial.reopen) {
      this.updateTargets(d, "detection");
    }
  }
  else if (type === "dbclick") {
    this.updateTargets(d, "collision");
  }
};

/*
  Converts d3 event to x,y screen coordinates
  Stores results in this.pos
  @param {d3 event} event
  @returns {}
*/
Sauron.prototype.convertMouseToCoord = function(event) {
  this.pos.x = event[0];
  this.pos.y = event[1];
};

/*
  Sauron alerts his generals of the new progress
  Updates score when target is clicked on
  @param {}
  @return {}
*/
Sauron.prototype.updateProgress = function() {
  var bar = d3.select('#progressbar'),
      scoreBox = d3.select('#score');
      currScore = bar.attr("aria-valuenow");
      if (Number(currScore) >= 100) {
        currScore = 100;
        scoreBox.text("Proceed To Next Level!");
      }
      else {
        if(this.level <= 1) {
          currScore = Number(currScore) + 100 / 20;
        }
        else {
          currScore = Number(currScore) + 100 / 24;
        }
        scoreBox.text(currScore + "% Complete");
      }

      bar.style("width", currScore + "%");
      bar.attr("aria-valuenow", currScore);
};

/*
  Draws blips that are dropped onto input svg
  @param {int} x
  @param {int} y
  @returns void
*/
Sauron.prototype.drawBlips = function(x,y) {
  var point = util.applyInverse(x, y, this.matrix);
  d3.select("#input-svg").append("circle")
                          .attr({
                            cx: point.x,
                            cy: point.y,
                            r: 20,
                          })
                          .attr("class", "blips")
                          .style({"fill": "url(#tarblip)"});
};
/*
  Draws random target on output svg
  @param {}
  @return {}
  The Sauron's army grows larger
  Slightly not optimal
  If matrix is invertible
  Divide by 0 then breaks
*/
Sauron.prototype.generateTarget = function(firstRun) {
  var initialOpacity = firstRun ? 1:0;
  var isValidCoordinate = false,
      matrix = this.matrix,
      par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
      newX, newY;

  while (!isValidCoordinate) {
    var point = {
      //40 px away from either lower end since, 40px=height/width of target
      x: util.getRandom(0, 460),
      y: util.getRandom(0, 460)
    };

    if ( util.isOnScreen(matrix, point)) {
      isValidCoordinate = true;
      var targetSettings = {
        x: point.x,
        y: point.y,
        width: 40,
        height: 40,
        color: "black",
        id: "random_"+this.deathToll,
        class:"new",
        opacity:""+initialOpacity
      };
      this.drawTarget(targetSettings);
    }
  }
};
/*
  Draws random circle of targets onto output svg
  @params {}
  @returns {}
*/
Sauron.prototype.generateRandomCircleofDeath = function(firstRun) {
  var initialOpacity = firstRun ? 1:0;

  var validPoints = util.getValidPreImageOval(this.matrix),
      i = 0;

  for( var key in validPoints ) {
    var pair = validPoints[key],
        screenCoors = util.mathToScreen(pair.x, pair.y, this.matrix);

    var targetSetting = {
      x: screenCoors[0],
      y: screenCoors[1],
      width: 40,
      height: 40,
      color: "black",
      id: "circle_"+i,
      class: "new",
      opacity: ""+initialOpacity
    };
    this.drawTarget(targetSetting);
    i++;
  }
};


//[{x:0,y:0},{x:5*(Math.sqrt(2)/2),y:5*(Math.sqrt(2)/2)},{x:5*Math.sqrt(2),y:5*Math.sqrt(2)},{x:-1*(5*Math.sqrt(2)/2),y:-1*(5*Math.sqrt(2)/2)},{x:-1*(5*Math.sqrt(2)),y:-1*(5*Math.sqrt(2))}];
/*
  Draws random line of targets onto output svg
  @param {bool} initial [Determines whether or not opacity should be 0]
  @return {} void
*/
Sauron.prototype.generateRandomLineofDeath = function(firstRun) {
  var initialOpacity = firstRun ? 1:0;

  var validPoints = util.getValidPreImagePairs(),
      i = 0;

  for( var key in validPoints ) {
    var pair = validPoints[key],
        screenCoors = util.mathToScreen(pair.x, pair.y, this.matrix);

    var targetSetting = {
      x: screenCoors[0],
      y: screenCoors[1],
      width: 40,
      height: 40,
      color: "black",
      id: "line_"+i,
      class: "new",
      opacity: ""+initialOpacity
    };
    this.drawTarget(targetSetting);
    i++;
  }
};

/*
  Draws random target on output svg
  @param {}
  @return {}
  The Sauron's army grows larger
  Slightly not optimal
  If matrix is invertible
  Divide by 0 then breaks
*/
Sauron.prototype.generateTargetPath = function(firstRun) {
  var initialOpacity = firstRun ? 1:0;
  var isValidCoordinate = false,
      matrix = this.matrix,
      par = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
      newX, newY;

  while (!isValidCoordinate) {
    var point = {
      //40 px away from either lower end since, 40px=height/width of target
      x: util.getRandom(0, 460),
      y: util.getRandom(0, 460)
    };

    if ( util.isOnScreen(matrix, point)) {
      isValidCoordinate = true;
      var targetSettings = {
        x: point.x,
        y: point.y,
        width: 40,
        height: 40,
        color: "black",
        id: "movingTarget",
        class:"new",
        opacity:""+initialOpacity
      };
      this.drawTarget(targetSettings);
    }
  }

    var point = {
      //40 px away from either lower end since, 40px=height/width of target
      x: util.getRandom(0, 460),
      y: util.getRandom(0, 460)
    };

    

};

/**
.each("end", repeat)  Wrapper for Target class.
  @param {obj} settings
  @returns void
*/
Sauron.prototype.drawTarget = function(settings) {
  var newTarget = new Target(settings);
  newTarget.drawTarget();
};

// Sauron is mobilized via Smaug!
module.exports = Sauron;
