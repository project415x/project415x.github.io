var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js');
		config = require('../level/playgroundConfig');

function initPlayground() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings),
			outputTarget = new Target(config.targetSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();

	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	outputTarget.init()
}

// Requires JQuery
function initTutorial() {
	// Initialize
	$(window).ready(function(){
		// Initialize Popover
		$('#tutorial').popover();
		// Dismissable when clicking general window elements
		$(window).click(function(event) {
				// var guide = document.getElementById('guide'),
				// 		img = document.getElementById('tutorial');
				console.log("1")
				// if(Sauron.tutorial.reclick) {
				// 	return;
				// }
				if(!Sauron.tutorial.show) {
					return;
				}

				// if (guide == event.target || img == event.target) {
				// 	if(Sauron.tutorial.show) {
				// 		Sauron.tutorial.clicked = true;
				// 	}
				// 	else {
				// 		return;
				// 	}
				// }
				console.log("pass1")
				Sauron.clearTimer();
				$('#tutorial').popover('hide');
				Sauron.tutorial.show = false;
				Sauron.tutorial.clicked = true;
				// Sauron.tutorial.reclick = false;
				// if(!Sauron.tutorial.clicked) {
				// 	Sauron.tutorial.clicked = true;
				// }
				// console.log(Sauron.tutorial, "1");
		});
		// Reopen tutorial
		$('#guide').click(function(event) {
			// var guide = document.getElementById('guide'),
			// 		img = document.getElementById('tutorial');
			console.log("2")
			if(Sauron.tutorial.show)
				return;
			// if (guide != event.target && img != event.target) {
			// 	return;
			// }
			// if(!Sauron.tutorial.show && Sauron.tutorial.clicked && Sauron.tutorial.reclick) {
			console.log("pass2")
				Sauron.tutorialControl(--Sauron.tutorial.num,1,true);
				Sauron.tutorial.clicked = false;
				Sauron.tutorial.show = true;
				Sauron.tutorial.reclick = true;
			// }
		});
	});
	// Load starting tutorial
	Sauron.tutorialControl(1,1000);
}

// think of this as the main function :)
startPlayground = function startPlayground() {
	// var Sauron = new Sauron(config);
	// Sauron.createArmy(1);
	initPlayground();
	initTutorial();
}
