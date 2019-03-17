var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js'),
		Sauron = require('../sauron/sauron.js'),
		Smaug = require('../smaug/smaug.js'),
		config = require('./config.js'),
		graphics = new Smaug(),
		Level1 = new Sauron(config.sauron);

// think of this as the main function :)
startLevel1 = function startLevel1() {
	// Create objects needed for game
	var inputCanvas = new Canvas(config.inputCanvasSettings,Level1),
			inputVector = new Vector(config.inputVectorSettings),
			outputVector = new Vector(config.outputVectorSettings),
			outputCanvas = new Canvas(config.outputCanvasSettings,Level1);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();
	graphics.drawRobot(1);


	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	Level1.lastClickedTime = Number((new Date()).getTime());
	Level1.generateRandomLineofDeath(true);
}