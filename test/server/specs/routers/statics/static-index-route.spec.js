var sinon = require('sinon');

describe('The Static Index Route class', function () {
	var StaticIndexRoute, sandbox, config;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		config = {
			index: 'bogus'
		};

		StaticIndexRoute = require('./../../../../../src/server/routers/statics/static-index-route');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		StaticIndexRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new StaticIndexRoute();
			instance.setup(config);
		});

		it('should be an instance of StaticIndexRoute', function () {
			var spy = sandbox.spy();
			var res = {
				sendFile: spy
			};

			instance.execute({}, res);

			spy.should.have.been.calledWith(config.index);
		});
	})
});
