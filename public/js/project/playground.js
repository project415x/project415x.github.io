var inputSettings = {
	minX: -10,
	minY: -10,
	maxX: 10,
	maxY: 10,
	pixelWidth: 500,
	pixelHeight: 500
};

var inputCanvas = new Canvas(inputSettings);

inputCanvas.drawAxes();

console.log(inputCanvas);
