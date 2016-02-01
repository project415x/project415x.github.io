function startLevel1() {


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

	var inputCanvas = canvas(inputSettings),
		outputCanvas = canvas(outputSettings),
		matrix = [[2,1],[1,-1]],
		score = 0,
		inputVector = vector(),
		oldOutputVector = vector(), 
		outputVector = vector(),
		targets = [target(Math.getRandomArbitrary(-9,9), Math.getRandomArbitrary(-9,9))];
		// change math to our 

	function updateLevel1(event) {

		// get coordinates
		var x = event.point.x,
			y = event.point.y;

		// update input/output vectors
		inputVector.updateVector(x,y);
		newCoordinates = applyMatrix(x,y,matrix);

		// this should copy the new into the old.
		oldOutputVector.copy(outputVector);
		outputVector.updateVector(newCoordinates[0],newCoordinates[1]);

		// draw input/output vectors
		inputCanvas.drawVector(inputVector);
		outputCanvas.drawVector(outputVector);

		// check collision (use line segments)
		var result = outputCanvas.checkCollisions(oldOutputVector,outputVector,targets);

		if(result.length !== 0) {

			for(var i = 0; i < result.length; i++) {
				// change x,y values for target
				this.randomizeTarget(result[i]);
				score += 10;
			}
		}
		// calculate proximity to target and update target color
		var dist = 0;

		for(var i = 0; i < targets.length; i++) {
			dist = outputCanvas.proximity(outputVector, targets[i]);
			this.target[i].updateColor(dist);
		}

		outputCanvas.drawTargets(targets);

	}

	// accepts a single target object as input
	function randomizeTarget(target) {
		target.updateColor(getRandomArbitrary(-9,9), getRandomArbitrary(-9,9));
	}
}