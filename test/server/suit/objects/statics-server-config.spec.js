var StaticsServerConfig = require('./../../../../src/server/object/statics-server-config');

describe('The StaticsServerConfig class', function () {
	var root = 'root/';
	var port = '3000';
	var index = 'index.html';


	it ('Should generated an object with the expected root property', function () {
		var config = new StaticsServerConfig(root);
		config.root.should.equal(root);
	});

	it ('Should generated an object with the expected port property', function () {
		var config = new StaticsServerConfig(root, port);
		config.port.should.equal(port);
	});

	it ('Should generated an object with the expected index property', function () {
		var config = new StaticsServerConfig(root, port, index);
		config.index.should.equal(root + index);
	});
});
