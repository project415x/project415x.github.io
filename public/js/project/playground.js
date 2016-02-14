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

<<<<<<< HEAD
var inputCanvas = new Canvas(inputSettings),
		inputVector = new Vector();
=======
//Style Things, should be put into a separate CSS file
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

var inputCanvas = new Canvas(inputSettings);
>>>>>>> oop-migration

// draw grid
// console.log(inputCanvas)
inputCanvas.drawGrid();
inputVector.init();



// draw vector
