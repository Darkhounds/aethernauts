var sinon = require('sinon');
var fs = require('./../../mockups/fs.mock');

describe('The Server Config class', function () {
	var ServerConfig, sandbox, root, port;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		root = 'root';
		port = '3000';
		fs.mockStart();
		ServerConfig = require('./../../../../src/server/object/server-config');
	});

	afterEach(function () {
		fs.mockStop();
		sandbox.restore();
	});

	it ('should be a function', function () {
		ServerConfig.should.be.an('function');
	});

	it('should output a warning when failing to load the default users data file', function () {
		var defaultUsersPath = root + ServerConfig.DATA + 'default-users.json';
		var expectedWarning = 'WARNING! ' +  defaultUsersPath + ' failed to load, using the default users instead';
		var spy = sandbox.stub(console, 'log');

		var instance = new ServerConfig(root, port);

		spy.should.have.been.calledWith(expectedWarning).once;
	});

	it('should output a warning when failing to load the secret data file', function () {
		var secretPath = root + ServerConfig.DATA + 'secret';
		var expectedWarning = 'WARNING! ' +  secretPath + ' failed to load, using the default secret instead';
		var spy = sandbox.stub(console, 'log');

		var instance = new ServerConfig(root, port);

		spy.should.have.been.calledWith(expectedWarning).once;
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			fs.addResponse('{"foo": "bar"}');
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

		it ('should have the default users property set to the expected value', function () {
			instance.defaultUsers.should.eql({foo: 'bar'});
		});

		it ('should have the secret property set to the expected value', function () {
			instance.secret.should.eql('something');
		});
	});
});
