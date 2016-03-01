// TODO:
// Migrate this to an external config.json
// so we can to something like
// var inputCanvas = Canvas(config.inputCanvas);
// ISOMORPHIC!!!

var inputCanvasSettings = {
	type: "input",
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	pixelWidth: 500,
	pixelHeight: 500
};

var outputCanvasSettings = {
	type: "output",
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	pixelWidth: 500,
	pixelHeight: 500
};

var inputVectorSettings = {
	type: "input",
	tail: {
		x: 250,
		y: 250
	},
	head: {
		x: 350,
		y: 100
	}
}

var outputVectorSettings = {
	type: "output",
	tail: {
		x: 250,
		y: 250
	},
	head: {
		x: 150,
		y: 100
	}
}

var targetSettings = {
	x: 355,
	y: 50,
	r: 20,
	color: "black",
	isScore: false
};

var scoreSettings = {
	x: 100,
	y: 100,
	r: 40,
	color: "green",
	isScore: true
}

var Canvas = require('../canvas/canvas.js'),
		Vector = require('../actors/vector.js'),
		Target = require('../actors/target.js');

function initPlayground() {
	// Create objects needed for game
	var inputCanvas = new Canvas(inputCanvasSettings),
			inputVector = new Vector(inputVectorSettings),
			outputVector = new Vector(outputVectorSettings),
			outputCanvas = new Canvas(outputCanvasSettings),
			outputTarget = new Target(targetSettings),
			scoreTarget = new Target(scoreSettings);

	// draw grid(s)
	inputCanvas.drawCanvas();
	outputCanvas.drawCanvas();
	outputCanvas.drawProgressBar();

	// draw vector(s)
	inputVector.init();
	outputVector.init();

	// generate target(s)
	outputTarget.init()
	scoreTarget.init();


}

function startPlayground() {
	initPlayground();
}

// think of this as the main function :)
startPlayground();
