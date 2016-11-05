describe('The Cypher Class', function () {
	var Cypher, mask;

	beforeEach(function () {
		mask = 'some mask';

		Cypher = require('./../../../../src/client/js/util/cypher');
	});

	it('Should be a function', function () {
		Cypher.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new Cypher();
		});

		it('should be an instance of the Cypher class', function () {
			instance.should.be.an.instanceOf(Cypher);
		});

		it('should return a base64 encoded result when using the encode method ', function () {
			var value = 'some value';
			var expectedValue = btoa(value);

			instance.encode(value).should.equal(expectedValue);
		});

		describe('after setting a mask', function () {
			beforeEach(function () {
				instance.setMask(mask);
			});

			it('should return a masked value to the expected result when using the mask method', function () {
				var value = 'some value';
				var maskedValue = instance.mask(value);

				maskedValue.should.be.a('string').with.length.above(0).and.not.equal(value).and.not.equal(mask);
			});
		});
	});
});