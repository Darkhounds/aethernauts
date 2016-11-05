var sinon = require('sinon');
var expect = require('chai').expect;

var Waterline = require('./../../mockups/waterline');
var WaterlineConfig = require('./../../mockups/object/waterline-config.mock');

describe('The Data Storage class', function () {
	var DataStorage, sandbox, config;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		config = new WaterlineConfig();
		Waterline.mockStart();

		DataStorage = require('./../../../../src/server/service/data-storage');
	});
	
	afterEach(function () {
		Waterline.mockStop();

		WaterlineConfig.restore();
		sandbox.restore();
	});

	it('should be function', function () {
		DataStorage.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new DataStorage();
		});

		it('should be an instance of DataStorage', function () {
			instance.should.be.an.instanceOf(DataStorage);
		});

		it('should setup the model being added', function () {
			var spy = sandbox.spy();
			var model = { setup: spy };

			instance.addModel('bogus', model);

			spy.should.have.been.calledWith(Waterline.getInstance());
		});

		it('should return the expected model', function () {
			var fooModel = { setup: function () {} };
			var bogusModel = { setup: function () {} };

			instance.addModel('foo', fooModel);
			instance.addModel('bogus', bogusModel);

			instance.getModel('bogus').should.equal(bogusModel);
		});

		it('should return null when requesting unexpected models', function () {
			var fooModel = { setup: function () {} };

			instance.addModel('foo', fooModel);

			expect(instance.getModel('bogus')).to.not.exist;
		});

		it('should initialize waterline with the expected config', function () {
			var waterline = Waterline.getInstance();
			var spy = sandbox.spy(waterline, 'initialize');

			instance.setup(config);

			return instance.initialize().then(function () {
				spy.should.have.been.calledWith(config);
			});
		});

		it('should initialize registered models', function () {
			var spy = sandbox.spy();
			var model = { setup: function () {}, initialize: spy };

			instance.setup(config);
			instance.addModel('foo', model);
			return instance.initialize().then(function () {
				spy.should.have.been.calledOnce;
			});
		});

		it('should reject more then one initialization', function (done) {
			instance.setup(config);
			instance.initialize().then(instance.initialize.bind(instance)).catch(function (error) {
				error.should.equal(DataStorage.ALREADY_INITIALIZED);
				done();
			});
		});
	});
});
