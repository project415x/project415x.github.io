var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		Smaug = require('../smaug/smaug.js'),
		config = require('./config.js'),
		graphics = new Smaug(),
		OverWatcher = new Sauron(config.sauron);

function initLevel3() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings);
			//outputTarget = new Target(config.targetSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();

	// draw vector(s)
	inputVector.init();
	outputVector.init();
	graphics.drawRobot(3);

	// generate target(s)
	OverWatcher.generateTarget(true);
}


// think of this as the main function :)
startLevel3 = function startLevel3() {
	initLevel3();
}
