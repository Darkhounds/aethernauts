var sinon = require('sinon');

// var ServerConfig = require('./../../../mockups/object/server-config.mock');

describe('The Favicon Route class', function() {
	var FaviconRoute, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		FaviconRoute = require('./../../../../../src/server/route/statics/favicon-route');
	});

	afterEach(function () {
		sandbox.restore();
	});
	
	it('should be a function', function () {
		FaviconRoute.should.be.a('function');
	});
	
	describe('as an instance', function () {
		var instance, config, icon;
		
		beforeEach(function () {
			config = {
				favicon: 'hjagsvdjhfasdgajsd=='
			};
			icon = new Buffer(config.favicon, 'base64');
			instance = new FaviconRoute();
			instance.setup(config);
		});

		it('should be an instance of FaviconRoute', function () {
			instance.should.be.an.instanceOf(FaviconRoute);
		});

		it('should write to the response the expected code', function () {
			var spy = sandbox.spy();
			var res = {writeHead: spy, end: function () {}};
			instance.execute({}, res);

			spy.should.have.been.calledWith(200);
		});

		it('should write to the response the expected content-type and length', function () {
			var expected = {
				'Content-Type': 'image/png',
				'Content-Length': icon.length
			};
			var spy = sandbox.spy();
			var res = {writeHead: spy, end: function () {}};
			instance.execute({}, res);

			spy.getCall(0).args[1].should.eql(expected);
		});

		it('should end the response with the expected data', function () {
			var spy = sandbox.spy();
			var res = {writeHead: function () {}, end: spy};
			instance.execute({}, res);

			spy.should.have.been.calledWith(icon);
		});
	});
});
