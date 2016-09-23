var waterlineConfig = require('./../../../../src/server/object/waterline-config');

describe('The Websocket Server Config class', function () {
	it ('should be an object', function () {
		waterlineConfig.should.be.an('object');
	});
});
