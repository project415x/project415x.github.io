function Tutorial(settings) {
  this.num =  1;
  this.show = false;
  this.reopen =  false;
  this.timer = null;
}

Tutorial.prototype.init = function() {
  // Initialize Popover
  $('#tutorial').popover();
};

Tutorial.prototype.tutorialControl = function(num, time, reclick) {
  tutor = this;
  if ((!this.show || !this.reopen) && num == this.num) {
    if (num === 1) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Click the radar screen to activate the robot arm!");
    };
    if (num === 2) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Click and drag the arm in the radar screen to move the robot's arm!");
    };
    if (num === 3) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.");
    };
    if (num === 4) {
      this.num++;
      d3.select('#tutorial').attr("data-content", "Double click the radar screen to collect the part");
    };
    setTimeout(function() {
        $('#tutorial').popover('show');
        console.log(tutor);
        tutor.show = true;
        tutor.reopen = false;
        console.log(tutor);
      }, time);
      console.log(this.show);
    if(!reclick) {
      this.setTimer(10000);
      tutor.show = false;
      tutor.reopen = true;
    }
  }
};

Tutorial.prototype.clearTimer = function() {
  clearTimeout(this.timer);
};

Tutorial.prototype.setTimer = function(time) {
  this.timer = setTimeout(function() {
    $('#tutorial').popover('hide');
  }, time);
};

module.exports = new Tutorial();
