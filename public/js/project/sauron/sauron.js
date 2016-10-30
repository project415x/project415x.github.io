var util = require('../utilities/math.js'),
    Target = require('../actors/target.js'),
    Tutorial = require('../tutorial/tutorial.js');

// Sauron is alive!
/*
  Default constuctor
  Sample settings object in game1, game2, game3
*/
function Sauron(settings) {
  this.armies = [];
  this.level = settings === {} ? -1 : settings.level;
  this.matrix = [[1,0],[0,1]];
  this.setMatrix();
  this.deathToll = 0;
  //if(window.innerHeight<770 || window.innerWidth<770){
  //  if (typeof InstallTrigger !== 'undefined'){
  //    $('body').css('MozTransform','scale(90%)');
  //    console.log("FF master race");
  //  } //firefox
  //  else{
  //    document.body.style.zoom = "90%";
  //  }
  //}
}
Sauron.prototype.setMatrix = function() {
    var rand = util.getRandom(1, 3);
    var m = [[rand,0], [0,rand]];

    var theta = util.getRandom(Math.PI/2, 3*Math.PI/2);

    var rot = [[Math.cos(theta), -Math.sin(theta)],[Math.sin(theta), Math.cos(theta)]];

    this.matrix = [[(rot[0][0]*m[0][0] + rot[0][1]*m[1][0]),
                        (rot[0][0]*m[0][1] + rot[0][1]*m[1][1])],
                        [(rot[1][0]*m[0][0] + rot[1][1]*m[1][0]),
                        (rot[1][0]*m[0][1] + rot[1][1]*m[1][1])]
                    ];
};

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
  var height = Math.sqrt((250 - i[0])*(250 - i[0]) + (250 - i[1])*(250 - i[1]));
  var angle = -1*Math.atan((i[0]-250.0)/(i[1]-250.0)) * 180.0 / Math.PI;
  if(i[1] > 250){
      angle += 180;
  }
  var width = 20;
  var ratio = "none";
  if(height < 300) {
      ratio = "xMinYMin slice";
  }
  if(d3.select('#output-vector').size() ===0){
      var arm = d3.select('#output-svg').append('image')
        .attr({
            "x": (i[0] - width/2),
            "y": i[1],
            "width": ""+ width +"px",
            "height": "" + height +"px",
            "preserveAspectRatio" : ratio,
            "id": 'output-vector',
            "xlink:href": "../public/img/robotarm.gif",
            "transform" : 'rotate('+angle +',' + i[0] + ',' + i[1] + ')'
      });
      //arm.style({"fill": "red"});
  }else{
      d3.select('#output-vector')
        .attr({
            "x": (i[0] - width/2),
            "y": i[1],
            "width": ""+ width +"px",
            "height": "" + 100 +"px",
            "preserveAspectRatio" : ratio,
            "transform" : 'rotate('+angle +',' + i[0] + ',' + i[1] + ')'
      });
  }
};

/*
  Sauron gets all of the targets in the output svg
  @returns {d3.selection} of targets
*/
Sauron.prototype.getArmies = function() {
  return d3.select("#output-svg").selectAll('.new-target');
};

/*
  After good news from the Palantir Sauron moves forces!
  @param {obj(int,int)} d
  @param {string} type
  @returns {}
*/
Sauron.prototype.updateTargets = function(d, type) {
  var list = this.getArmies();
  var i = util.applyMatrix(d.x,d.y,this.matrix);
  var self = this;
  //if (list.style("opacity")<1){
  //  console.log("Done");
  //  return;
  //}
  list.each(function(){
    var wraith = d3.select(this),
      id = wraith.attr("id"),
      width = Number(wraith.attr("width")),
      height = Number(wraith.attr("height")),
      x = Number(wraith.attr("x")) + width / 2,
      y = Number(wraith.attr("y")) + height / 2;
    //console.log(id);
    if (util.isClose(i[0], i[1], x, y, width / 2, height / 2)) {
      if(wraith.sprite().style("opacity")>0.9)
        wraith.sprite().jump(10, 250);
      if (type === "collision") {

        wraith.sprite().transition();

        d3.select(wraith.node().parentNode).attr("class", "clicked");

        wraith.setClicked();
        wraith.sprite().transition().attr("y", wraith.attr("y")).style("opacity", 0.4).duration(250);

        self.deathToll++;

        self.updateProgress();
        self.drawBlips(x,y);

        if( self.getArmies().size() === 0 ) {
          self.generateNewTargets(id);
        }
      }
      else if (type === "detection") {
        Tutorial.tutorialControl(4,1);
      }
    }
    else{
      wraith.sprite().transition().style("opacity", 1).attr("y", wraith.attr("y"));
    }
  });
};

/*

  @param {} none
  @returns {} int
*/
Sauron.prototype.checkNumberOfBlips = function() {
  return d3.selectAll(".blips").size();
};

Sauron.prototype.removeBlips = function(generator) {
  this.deathToll = 0;
  //d3.selectAll(".clicked").remove();
  d3.selectAll(".clicked-sprite").transition().style("opacity", 1).duration(100);
  d3.selectAll(".clicked, .blips").slowDeath(2000);
  setTimeout(function(){
    d3.selectAll(".clicked").remove()
    d3.selectAll(".new").isBorn(500);
  }, 2001);
};

/*
  Depending on level, logic to draw new targets
  @param {string} id , of dom element related to target
  @returns {}
*/
Sauron.prototype.generateNewTargets = function(id) {
  if (id.indexOf("random") !== -1) {
    var flag = false;
    if(this.checkNumberOfBlips() >= 5) {
      this.removeBlips();
      flag = true;
    }
    this.generateTarget(!flag);
  }
  else if (id.indexOf("line") !== -1) {
    this.generateRandomLineofDeath();
    this.removeBlips();
  }
  else if (id.indexOf("circle") !== -1) {
    this.generateRandomCircleofDeath();
    this.removeBlips();
  }
  this.setMatrix();
};
/*
  Palantir reveals new plans to Sauron
  What do to when an event is registered on the input canvas
  @param {d3 event} event
  @param {string} type
  @return {}
*/
Sauron.prototype.tellSauron = function(event, type) {
  var d = this.convertMouseToCoord(event);
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
  @param {d3 event} event
  @returns {obj(int,int)}
*/
Sauron.prototype.convertMouseToCoord = function(event) {
  return {
    x: event[0],
    y: event[1]
  }
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
      x: util.getRandom(0, 500),
      y: util.getRandom(0, 500)
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
        class: "new",
        opacity:""+initialOpacity
      };
      this.drawTarget(targetSettings);
    }
  }
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
      opacity:""+initialOpacity
    };
    this.drawTarget(targetSetting);
    i++;
  }
};


//[{x:0,y:0},{x:5*(Math.sqrt(2)/2),y:5*(Math.sqrt(2)/2)},{x:5*Math.sqrt(2),y:5*Math.sqrt(2)},{x:-1*(5*Math.sqrt(2)/2),y:-1*(5*Math.sqrt(2)/2)},{x:-1*(5*Math.sqrt(2)),y:-1*(5*Math.sqrt(2))}];
/*
  Draws random line of targets onto output svg
  @param {}
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
      opacity:""+initialOpacity
    };
    this.drawTarget(targetSetting);
    i++;
  }
};

/**
  Wrapper for Target class.
  @param {obj} settings
  @returns void
*/
Sauron.prototype.drawTarget = function(settings) {
  var newTarget = new Target(settings);
  newTarget.drawTarget();
};

// Sauron is mobilized via Smaug!
module.exports = Sauron;
