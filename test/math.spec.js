var math = require('../public/js/project/utilities/math.js'),
		expect = require('chai').expect;

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
		var mathToScreen = math.mathToScreen(-8, 8);
		expect(mathToScreen[0]).to.equal(50);
		expect(mathToScreen[1]).to.equal(50);
		done();
	});

	it('should correctly translate screen to math coordinates', function(done) {
		var screenToMath = math.screenToMath(50, 50);
		expect(screenToMath[0]).to.equal(-8);
		expect(screenToMath[1]).to.equal(8);
		done();
	});

	it('should correctly apply a linear transformation', function(done) {

		expect(value).to.exist();
		done();
	});

	it('should correctly calculate an inverse for a given matrix', function(done) {
		expect(value).to.exist();
		done();
	});

	it('should generate valid preimage circle points', function(done) {
		expect(value).to.exist();
		done();
	});

	it('should generate valid preimage oval points', function(done) {
		expect(value).to.exist();
		done();
	});

	it('should generate valid preimage pairs', function(done) {
		expect(value).to.exist();
		done();
	});

});