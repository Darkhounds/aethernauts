var sinon = require('sinon');

describe('The Static Assets Route class', function () {
	var StaticAssetsRoute, sandbox, config;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		config = {
			statics: 'bogus'
		};

		StaticAssetsRoute = require('./../../../../../src/server/routers/statics/static-assets-route');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		StaticAssetsRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new StaticAssetsRoute();
			instance.setup(config);
		});

		it('should be an instance of StaticAssetsRoute', function () {
			instance.should.be.an.instanceOf(StaticAssetsRoute);
		});

		it('should send the requested file', function () {
			var expectedFile = 'test';
			var spy = sandbox.spy();
			var req = {
				baseUrl: 'lib/' + expectedFile
			};
			var res = {
				sendFile: spy
			};
			instance.execute(req, res);

			spy.should.have.been.calledWith(config.statics + '/' + expectedFile)
		});
	});
});
