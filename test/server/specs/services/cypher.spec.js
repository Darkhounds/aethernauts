var ServerConfig = require('./../../mockups/objects/server-config.mock');
var md5 = require('md5');
var btoa = require('abab').btoa;

describe('The Cypher class', function () {
	var Cypher, config;

	beforeEach(function () {
		ServerConfig.setSecret('bogus');
		config = new ServerConfig();

		Cypher = require('./../../../../src/server/services/cypher');
	});

	afterEach(function () {
		ServerConfig.restore();
	});

	it('should be a function', function () {
		Cypher.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new Cypher();
		});

		it('should be an instance of Cypher', function () {
			instance.should.be.an.instanceOf(Cypher);
		});

		it('should decode a base64 encoded message back to utf8 when using the decode methos', function () {
			var expectedValue = 'some value';
			var value = btoa(expectedValue);

			instance.decode(value).should.equal(expectedValue);
		});

		it('should unmask value', function () {
			var mask = 'some mask';
			var masked = '0 0 0 0 0 1b 0 1f 1e 16';
			var expectedValue = 'some value';

			instance.unmask(masked, mask).should.equal(expectedValue);
		});

		describe('after setup', function () {
			beforeEach(function () {
				instance.setup(config);
			});
			
			it('should md5 a value with the encrypt method', function () {
				var value = 'foo';
				var expectedValue = md5(value + ServerConfig.getInstance().secret);

				instance.encrypt(value).should.equal(expectedValue);
			});

			it('should generate a new mask', function () {
				var mask = instance.generateMask();
				mask.should.be.a('string').with.lengthOf(32);
			});
		});
	});
});