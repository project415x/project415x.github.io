module.exports = {

	inputCanvasSettings : {
		type: "input",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		//pixelWidth: 500,
		//pixelHeight: 500
	},

	outputCanvasSettings : {
		type: "output",
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10,
		//pixelWidth: 500,
		//pixelHeight: 500
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
		},
		stroke: 9
	},

	targetSettings : {
		x: 355,
		y: 50,
		r: 20
	},

	sauron : {
		matrix: [[1,2],[2,1]],
		level: 1,
		type: "random"
	}
};
