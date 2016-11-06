var WaterlineConfig = require('./../../../../src/server/object/waterline-config');

describe('The Waterline Config class', function () {
	var storageLocation = 'data';

	it ('should be a function', function () {
		WaterlineConfig.should.be.an('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new WaterlineConfig(storageLocation);
		});

		it ('should have the connections.default.filePath property to the expected value', function () {
			instance.connections.default.filePath.should.equal(storageLocation);
		});
	});
});
