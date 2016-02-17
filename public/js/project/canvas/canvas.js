/**
* CLASS CONSTRUCTOR
* @PARAM settings
  var settings = {
    minX: -10,
    minY: -10,
    maxX: 10,
    maxY: 10,
    pixelWidth: 500,
    pixelHeight: 500
  }
* USAGE: var inputCanvas = Canvas(inputCanvasSettings);
*/
function Canvas(settings) {
  //input error handling
  this.minX = settings.minX || -10,
  this.minY = settings.minY || -10,
  this.maxX = settings.maxX || 10,
  this.maxY = settings.maxY || 10,
  this.pixelWidth = settings.pixelWidth || 500,
  this.pixelHeight = settings.pixelHeight || 500,
  this.originX = (0.5 * this.pixelWidth) || 250,
  this.originY = (0.5 * this.pixelHeight) || 250,
  this.origin = {
    x: this.originX,
    y: this.originY
  };
  this.type = settings.type || "not a valid type";
}

Canvas.prototype.drawCanvas = function() {
  if(this.type) {
    d3.select('#'+this.type+'-canvas').append('svg')
    .attr({
      id: this.type+"-svg",
      width: this.pixelWidth,
      height: this.pixelHeight
    })
    .on("click", function(d, i) {
      console.log('d3 event', d3.event)
    });
  }
  else {
    console.log("Invalid canvas type: ",this.type)
  }
};


/**
*
*
*/
Canvas.prototype.checkCollisions = function(oldVector,newVector,targets) {
  var start_x = oldVector.x,
      start_y = oldVector.y,
      end_x = newVector.x,
      end_y = newVector.y,
      results = [];
  for (i = 0; i < targets.length; i++) {
    var tar_x = targets[i].x,
        tar_y = targets[i].y;
    //10 pixels is from Joseph's old settings
    if (isClose(end_x,end_y,tar_x,tar_y,10)) {
      results[i] = true;
    }
    else {
      var param =(tar_x - start_x) * (end_x - start_x) + (tar_y - start_y) * (end_y - start_y);
      var temp = Math.pow((end_x - start_x),2) + Math.pow((end_y - start_y),2);
      param /= temp;
      var dis_x = start_x + param * (end_x - start_x);
      var dis_y = start_y + param * (end_y - start_y);
      //10 pixels is from Joseph's old settings
      if (isClose(dis_x,dis_y,tar_x,tar_y,10)) {
        results[i] = true;
      }
      else {
        results[i] = false;
      }
    }
  }
  return results;
}


Canvas.prototype.isClose = function(oX, oY, tX, tY, radius) {
  var dist = Math.sqrt(Math.pow((tX - oX),2) + Math.pow((tY - oY),2));
  if (dist <= radius) {
    return true;
  }
  return false;
}

Canvas.prototype.proximity = function(outputVector, target) {
    if (isClose(targetX, targetY, 500)) {
      target.updateColor('#e5e5ff', target.id);
    }
    else if (isClose(targetX, targetY, 450)) {
      target.updateColor('#ccccff', target.id);
    }
    else if (isClose(targetX, targetY, 400)) {
      target.updateColor('#b2b2ff', target.id);
    }
    else if (isClose(targetX, targetY, 350)) {
      target.updateColor('#9999ff', target.id);
    }
    else if (isClose(targetX, targetY, 300)) {
      target.updateColor('#7f7fff', target.id);
    }
    else if (isClose(targetX, targetY, 250)) {
      target.updateColor('#6666ff', target.id);
    }
    else if (isClose(targetX, targetY, 200)) {
      target.updateColor('#4c4cff', target.id);
    }
    else if (isClose(targetX, targetY, 150)) {
      target.updateColor('#3232ff', target.id);
    }
    else if (isClose(targetX, targetY, 100)) {
      target.updateColor('#1919ff', target.id);
    }
    else if (isClose(targetX, targetY, 50)) {
      target.updateColor('#0000ff', target.id);
    }
  }

/**
* @PARAM target object as described in target.js
* @RETURNS nothing
*/
Canvas.prototype.drawTarget = function(target) {
  // grab svg container
  d3.select('#'+this.type+'-canvas').append("circle")
    .attr({
      cx: target.x,
      cy: target.y,
      r: target.r,
      color: target.color
    });
};

Canvas.prototype.drawTargets = function(targets) {
  // just a for loop with drawTarget
  for( var i = 0; i < targets.length; i++ ) {
    drawTarget(targets[i]);
  }
};
