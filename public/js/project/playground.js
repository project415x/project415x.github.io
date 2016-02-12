var inputSettings = {
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	pixelWidth: 500,
	pixelHeight: 500
};

var outputSettings = {
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	pixelWidth: 500,
	pixelHeight: 500
};

document.body.style.backgroundColor = "red";

var inputCanvas = new Canvas(inputSettings);

// draw grid
inputCanvas.drawGrid();

// draw vector
