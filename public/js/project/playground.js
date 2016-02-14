// TODO:
// Migrate this to an external settings.json
// so we can to something like
// var inputCanvas = settings.inputCanvas;
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

// Create objects needed for game
var inputCanvas = new Canvas(inputCanvasSettings),
		inputVector = new Vector(inputVectorSettings),
		outputVector = new Vector(outputVectorSettings),
		outputCanvas = new Canvas(outputCanvasSettings);

// draw grid(s)
inputCanvas.drawCanvas();
outputCanvas.drawCanvas();

// draw vector(s)
inputVector.init();
outputVector.init();

// onclick canvas && drag event listeners to handle movement of vectors
// apply linear transformations


//Style Things, should be put into a separate CSS file or function?
var in_div = document.getElementById('input-canvas');
in_div.style.height = '500px';
in_div.style.width = '500px';
in_div.style.float = 'left';
in_div.style.backgroundImage = 'url(../public/img/input_background.gif)';
in_div.style.backgroundRepeat = 'no-repeat';

var out_div = document.getElementById('output-canvas');
out_div.style.height = '500px';
out_div.style.width = '500px';
out_div.style.float = 'right';
out_div.style.backgroundImage = 'url(../public/img/output_background.png)';
out_div.style.backgroundRepeat = 'no-repeat';

