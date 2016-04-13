module.exports = {

	inputCanvasSettings : {
		type: "input",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		pixelWidth: 500,
		pixelHeight: 500
	},

	outputCanvasSettings : {
		type: "output",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		pixelWidth: 500,
		pixelHeight: 500
	},

	inputVectorSettings : {
		type: "input",
		tail: {
			x: null,
			y: null
		},
		head: {
			x: null,
			y: null
		}
	},

	outputVectorSettings : {
		type: "output",
		tail: {
			x: null,
			y: null
		},
		head: {
			x: null,
			y: null
		}
	}
};