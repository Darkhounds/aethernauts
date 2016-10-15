var sinon = require('sinon');

describe('The Static Index Route class', function () {
	var StaticIndexRoute, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		StaticIndexRoute = require('./../../../../../src/server/route/statics/static-index-route');
	});

	it('should be a function', function () {
		StaticIndexRoute.should.be.a('function');
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance, config;

		beforeEach(function () {
			config = {
				index: 'bogus'
			};
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
