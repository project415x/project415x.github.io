/**
* Level Tracking
* @description: Mechanism for tracking levels in gameplay
*/

// Track the levels
var levelTracking = 1;
function loadPage(id, levelMove, guide){
  var currentLevel = levelTracking + parseInt(levelMove);

  if(currentLevel < 1) {
    document.getElementById("lowerBound").disabled = "disabled";
    document.getElementById("upperBound").disabled = "";
    levelTracking = 1;
  } else if ( currentLevel > 3 ) {
    document.getElementById("lowerBound").disabled = "";
    document.getElementById("upperBound").disabled = "disabled";
    levelTracking = 3;
  } else {
    document.getElementById("lowerBound").disabled = "";
    document.getElementById("upperBound").disabled = "";
    levelTracking = currentLevel;
  }

  var dataText = "../level" + levelTracking
  if(guide == 0) {
    dataText = dataText + "/index.html";
  } else if(guide == 1) {
    dataText = dataText + "guide/index.html";
  }

  document.getElementById(id).innerHTML='<object type="text/html" data=' + dataText + ' height="100%" width="100%"></object>';
}

// Show info button after a certain amount of time
setTimeout(function() {
  $('.infoLeft').fadeIn();
}, 5000);
