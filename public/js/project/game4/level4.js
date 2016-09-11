var Canvas = require('../canvas/canvas.js'),h
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		config = require('./config.js'),
		OverWatcher = new Sauron(config.sauron);

function initLevel4() {
	console.log("4");
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

	// generate target(s)
	OverWatcher.generateTarget(true);
}


// think of this as the main function :)
startLevel4 = function startLevel3() {
	initLevel4();
}
