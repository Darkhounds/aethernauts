var fs = require('./../../mockups/fs.mock');

describe('The Server Config class', function () {
	var ServerConfig, root, port;

	beforeEach(function () {
		root = 'root/';
		port = '3000';
		fs.mockStart();
		ServerConfig = require('./../../../../src/server/object/server-config');
	});

	afterEach(function () {
		fs.mockStop();
	});

	it ('should be a function', function () {
		ServerConfig.should.be.an('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			fs.addResponse(true);
			fs.addResponse('something');
			instance = new ServerConfig(root, port);
		});

		it ('should have the root property set to the expected value', function () {
			instance.root.should.equal(root);
		});

		it ('should have the port property set to the expected value', function () {
			instance.port.should.equal(port);
		});

		it ('should have the statics property set to the expected value', function () {
			instance.statics.should.equal(root + ServerConfig.STATICS);
		});

		it ('should have the index property set to the expected value', function () {
			instance.index.should.equal(root + ServerConfig.INDEX);
		});
	});
});
