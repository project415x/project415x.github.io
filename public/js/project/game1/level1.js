var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		Smaug = require('../smaug/smaug.js'),
		Tutorial = require('../tutorial/tutorial.js'),
		config = require('./config.js'),
		graphics = new Smaug(),
		Level1 = new Sauron(config.sauron);

function initTutorial() {
	// Requires JQuery included on each page
	$(window).ready(function() {
		// Initialize Tutorial
		Tutorial.init()
		// Dismissable when clicking general window elements
		$('#guide').click(function(event) {
				var guide = document.getElementById('guide');
				var img = document.getElementById('tutorial');
				if(!Tutorial.show) {
					return;
				}
				if((event.target == img || event.target == guide) && Tutorial.reopen) {
					return;
				}
				Tutorial.clearTimer();
				$('#tutorial').popover('hide');
				Tutorial.show = false;
				Tutorial.reopen = true;
		});
		// Reopen tutorial
		$('#tutorial').click(function(event) {
			if(Tutorial.show || !Tutorial.reopen) {
				return;
			}
			Tutorial.tutorialControl(--Tutorial.num,1,true);
		});
		// Load starting tutorial
		Tutorial.tutorialControl(1,5000);
	});
}
function initLevel1() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();
	graphics.drawRobot(1);


	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	Level1.generateRandomLineofDeath(true);
}


// think of this as the main function :)
startLevel1 = function startLevel1() {
	initLevel1();
	initTutorial();
}
