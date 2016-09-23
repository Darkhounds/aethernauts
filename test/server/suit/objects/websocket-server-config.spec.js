var WebsocketServerConfig = require('./../../../../src/server/object/websocket-server-config');

describe('The Websocket Server Config class', function () {
	var port = '3000';

	it ('Should generated an object with the expected port property', function () {
		var config = new WebsocketServerConfig(port);
		config.port.should.equal(port);
	});
});
