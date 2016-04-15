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
				var guide = document.getElementById('guide');
				var img = document.getElementById('tutorial');
				if(!Sauron.tutorial.show) {
					return;
				}
				if((event.target == img || event.target == guide) && Sauron.tutorial.reopen) {
					return;
				}
				Sauron.clearTimer();
				$('#tutorial').popover('hide');
				Sauron.tutorial.show = false;
				Sauron.tutorial.reopen = true;
		});
		// Reopen tutorial
		$('#tutorial').click(function(event) {
			if(Sauron.tutorial.show || !Sauron.tutorial.reopen) {
				return;
			}
			Sauron.tutorialControl(--Sauron.tutorial.num,1,true);
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
