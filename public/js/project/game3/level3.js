var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js')
		config = require('./config.js');
		OverWatcher = new Sauron(config.sauron);

function initLevel3() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();

	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	OverWatcher.generateRandomCircleofDeath();
}


// think of this as the main function :)
startLevel3 = function startLevel3() {
	initLevel3();
}
