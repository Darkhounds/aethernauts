var ServerConfig = require('./../../mockups/object/server-config.mock');
var md5 = require('md5');

describe('The Cypher class', function () {
	var Cypher;

	beforeEach(function () {
		ServerConfig.mockStart();
		Cypher = require('./../../../../src/server/component/cypher');
	});

	afterEach(function () {
		ServerConfig.mockStop();
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

		describe('after setup', function () {
			var config;

			beforeEach(function () {
				ServerConfig.setSecret('bogus');
				config = new ServerConfig();
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