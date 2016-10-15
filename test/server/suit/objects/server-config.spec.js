var ServerConfig = require('./../../../../src/server/object/server-config');

describe('The Server Config class', function () {
	var root = 'root/';
	var port = '3000';

	it ('should be a function', function () {
		ServerConfig.should.be.an('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
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
