var sinon = require('sinon');

describe('The Log Route class', function () {
	var ip = '127.0.0.1';
	var protocol = 'http';
	var host = 'localhost';
	var url = '/bogus';
	var LogRoute, sandbox, consoleLog;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		consoleLog = sandbox.stub(console, 'log');

		LogRoute = require('./../../../../../src/server/routers/statics/log-route');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		LogRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, req;

		beforeEach(function () {
			req = {
				connection: {},
				headers: {},
				get: function () { return host },
				protocol: protocol,
				originalUrl: url
			};
			instance = new LogRoute();
		});

		it('should be an instance of LogRoute', function () {
			instance.should.be.an.instanceOf(LogRoute);
		});

		it('should output the expected when the request x-forwarded-for is set after executing', function () {
			var path = protocol + '://' + host + url;
			var res = {};
			var next = function () {};
			req.headers['x-forwarded-for'] = ip;

			instance.execute(req, res, next);

			consoleLog.should.have.been.calledWith(LogRoute.PREFIX, ip, path);
		});

		it('should output the expected when the request remoteAddress is set after executing', function () {
			var path = protocol + '://' + host + url;
			var res = {};
			var next = function () {};
			req.connection.remoteAddress = ip;

			instance.execute(req, res, next);

			consoleLog.should.have.been.calledWith(LogRoute.PREFIX, ip, path);
		});

		it('should invoke the next call back after executing', function () {
			var path = protocol + '://' + host + url;
			var res = {};
			var next = sandbox.spy();
			req.connection.remoteAddress = ip;

			instance.execute(req, res, next);

			next.should.have.been.calledOnce;
		});
	});
});
