/*
  Default constuctor
*/
function Tutorial(settings) {
  this.num =  1;
  this.show = false;
  this.reopen =  false;
  this.timer = null;
}

/**
 * [init using jQuery opens modal]
 * @return {[none]}
 */
Tutorial.prototype.init = function() {
  // Initialize Popover
  $('#tutorial').popover();
};
/*
  Mind that controls tutorials
  @param {int} num
  @param {int} time
  @param {boolean} if it is reopened
*/
Tutorial.prototype.tutorialControl = function(time) {
  var tutor = this;
  console.log("called tutorialControl "+tutor.num);
  if (!this.show || !this.reopen) {
    if (tutor.num === 1) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Click the radar screen to activate the robot arm!");
    } else if (tutor.num === 2) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Click and drag the arm in the radar screen to move the robot's arm!");
    } else if (tutor.num === 3) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.");
    } else if (tutor.num === 4) {
      tutor.num++;
      d3.select('#tutorial').attr("data-content", "Double click the radar screen to collect the part");
    } else {
      tutor.show = false;
      $('#tutorial').popover('hide');
      return;
    }

    //setTimeout(function() {
    $('#tutorial').popover('show');
    tutor.show = true;
    tutor.reopen = false;
    console.log("asdf");

    //  }, 0);
    setTimeout(function() {

      console.log("timer done "+tutor.num);
      tutor.tutorialControl(time, false);
    }, time);

    //if(!reclick) {
    //  tutor.setTimer(10000);
    //  tutor.show = false;
    //  tutor.reopen = true;
    //}
  }
};
/*
  Resets tutorial timer
  @param {}
  @return {}
*/
Tutorial.prototype.clearTimer = function() {
  clearTimeout(this.timer);
};
/*
  Set tutorial timer
  @param {int} time
  @param {tutorial} tutorial
  @returns void
*/
Tutorial.prototype.setTimer = function(time) {
  this.timer = setTimeout(function() {
    $('#tutorial').popover('hide');
  }, time);
};

module.exports = new Tutorial();
