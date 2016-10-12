var sinon = require('sinon');
var expect = require('chai').expect;

var Waterline = require('./../../mockups/waterline');
var WaterlineConfig = require('./../../mockups/object/waterline-config.mock');

describe('The Data Storage class', function () {
	var DataStorage, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		Waterline.mockStart();
		WaterlineConfig.mockStart();
		DataStorage = require('./../../../../src/server/component/data-storage');
	});
	afterEach(function () {
		DataStorage = null;
		WaterlineConfig.mockStop();
		Waterline.mockStop();
		sandbox.restore();
	});

	it('should be function', function () {
		DataStorage.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, spy;

		beforeEach(function () {
			instance = new DataStorage();
			spy = sandbox.spy();
		});

		it('should be an instance of DataStorage', function () {
			instance.should.be.an.instanceOf(DataStorage);
		});

		it('should create a WaterlineConfig instance with the expected arguments', function () {
			var storageLocation = 'bogus';

			instance.setup(storageLocation);

			WaterlineConfig.should.have.been.calledWith(storageLocation).once;
		});

		it('should setup the model being added', function () {
			var spy = sandbox.spy();
			var model = { setup: spy };
			var waterline = Waterline.getInstance();

			instance.addModel('bogus', model);

			spy.should.have.been.calledWith(waterline);
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

		it('should initialize waterline with the expected config', function (done) {
			var waterline = Waterline.getInstance();
			var config = WaterlineConfig.getInstance();
			var spy = sandbox.spy(waterline, 'initialize');

			instance.setup('bogus');
			instance.initialize().then(function () {
				spy.should.have.been.calledWith(config);

				done();
			});
		});

		it('should initialize registered models', function (done) {
			var spy = sandbox.spy();
			var model = { setup: function () {}, initialize: spy };

			instance.setup('bogus');
			instance.addModel('foo', model);
			instance.initialize()
				.then(function () {
					spy.should.have.been.calledOnce;
					done();
				});
		});

		it('should reject mode then one initialization', function (done) {
			instance.setup('bogus');
			instance.initialize()
				.then(instance.initialize.bind(instance))
				.catch(function (error) {
					error.should.equal(DataStorage.ALREADY_INITIALIZED);
					done();
				});
		});
	});
});
