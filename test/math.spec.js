var math = require('../public/js/project/utilities/math.js'),
		expect = require('chai').expect,
		screenCoords = [50, 50],
		mathCoords = [-8, 8],
		matrix = [[2, 3], [1, 2]],
		transformedCoords = [450, 50],
		inverseCoords = [-750, -350];

describe('Test Suite for Math Utility Functions', function() {

	it('should handle invalid input for screen to math translation', function(done) {
		var invalidX = math.screenToMath(undefined, 2),
				invalidY = math.screenToMath(2, undefined);

		expect(invalidX).to.be.a('array');
		expect(invalidX).to.be.a('array');
		expect(invalidX).to.have.length(2);
		expect(invalidX).to.have.length(2);
		expect(invalidX[0]).to.not.equal(NaN);
		expect(invalidY[0]).to.not.equal(NaN);
		expect(invalidX[1]).to.not.equal(NaN);
		expect(invalidY[1]).to.not.equal(NaN);
		done();
	});

	it('should handle invalid input for math to screen translation', function(done) {
		var invalidX = math.mathToScreen(undefined, 2),
				invalidY = math.mathToScreen(2, undefined);

		expect(invalidX).to.be.a('array');
		expect(invalidX).to.be.a('array');
		expect(invalidX).to.have.length(2);
		expect(invalidX).to.have.length(2);
		expect(invalidX[0]).to.not.equal(NaN);
		expect(invalidY[0]).to.not.equal(NaN);
		expect(invalidX[1]).to.not.equal(NaN);
		expect(invalidY[1]).to.not.equal(NaN);
		done();
	});

	it('should correctly translate math to screen coordinates', function(done) {
		var mathToScreen = math.mathToScreen(mathCoords[0], mathCoords[1]);
		expect(mathToScreen[0]).to.equal(screenCoords[0]);
		expect(mathToScreen[1]).to.equal(screenCoords[1]);
		done();
	});

	it('should correctly translate screen to math coordinates', function(done) {
		var screenToMath = math.screenToMath(screenCoords[0], screenCoords[1]);
		expect(screenToMath[0]).to.equal(mathCoords[0]);
		expect(screenToMath[1]).to.equal(mathCoords[1]);
		done();
	});

	it('should correctly apply a linear transformation to screen coordinates', function(done) {
		var transformed = math.applyMatrix(screenCoords[0], screenCoords[1], matrix);
		expect(transformed[0]).to.equal(transformedCoords[0]);
		expect(transformed[1]).to.equal(transformedCoords[1]);
		done();
	});

	// should follow same conventions as other similar functions
	it('should correctly calculate an inverse for a given matrix', function(done) {
		var inverse = math.applyInverse(screenCoords[0], screenCoords[1], matrix);
		expect(inverse.x).to.equal(inverseCoords[0]);
		expect(inverse.y).to.equal(inverseCoords[1]);
		done();
	});

	// same as above. goofy that we have to convert ARRAY -> JS Obj
	it('should generate valid preimage circle points', function(done) {
		var points = math.getValidPreImageCircle();
		for (var point in points) {
			var screen = math.mathToScreen(point.x, point.y);
			var test = {
				x: screen[0],
				y: screen[1]
			}
			if (!math.isOnScreen(matrix, test)) {
				expect(err).to.not.exist;
			}
		}
		done();
	});

	it('should generate valid preimage oval points', function(done) {
		var points = math.getValidPreImageOval(matrix);
		for (var point in points) {
			var screen = math.mathToScreen(point.x, point.y);
			var test = {
				x: screen[0],
				y: screen[1]
			}
			if (!math.isOnScreen(matrix, test)) {
				expect(err).to.not.exist;
			}
		}
		done();
	});

	it('should generate valid preimage pairs', function(done) {
		var points = math.getValidPreImagePairs();
		for (var point in points) {
			var screen = math.mathToScreen(point.x, point.y);
			var test = {
				x: screen[0],
				y: screen[1]
			}
			if (!math.isOnScreen(matrix, test)) {
				expect(err).to.not.exist;
			}
		}
		done();
	});

});