var sinon = require('sinon');

describe('The LoggerRoute class', function () {
	var LoggerRoute, sandbox, consoleLog, server;
	var ip = 'localhost';
	var protocol = 'http';
	var host = 'foo';
	var url = '/bar';

	function generateRequest(useRemoteAddress) {
		return {
			headers: {
				'x-forwarded-for': useRemoteAddress?'':ip
			},
			connection: {
				remoteAddress: useRemoteAddress?ip:''
			},
			protocol: protocol,
			get: function (name) {
				switch (name) {
					default: return host
				}
			},
			originalUrl: url
		}
	}

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		consoleLog = sandbox.stub(console, 'log');
		server = {use: function () {}};

		LoggerRoute = require('./../../../../../src/server/component/router/logger-route');
	});
	afterEach(function () {
		sandbox.restore();
	});

	it ('should be a function', function () {
		LoggerRoute.should.be.a('function');
	});

	it ('should invoke the server "use" without any filter', function () {
		sandbox.stub(server, 'use', function(callback) {
			callback.should.be.a('function');
		});

		LoggerRoute(server);
	});

	it ('should log the ip of the request with a "remoteAddress" ', function () {
		var req = generateRequest(true);

		sandbox.stub(server, 'use', function(callback) {
			callback(req, {}, function () {});
			consoleLog.should.have.been.calledWith(LoggerRoute.PREFIX, ip);
		});

		LoggerRoute(server);
	});

	it ('should log the ip of the request with a "x-forwarded-for" ', function () {
		var req = generateRequest(false);

		sandbox.stub(server, 'use', function(callback) {
			callback(req, {}, function () {});
			consoleLog.should.have.been.calledWith(LoggerRoute.PREFIX, ip);
		});

		LoggerRoute(server);
	});

	it ('should log the path of the request', function () {
		var req = generateRequest();
		var address = protocol + '://' + host + url;
		sandbox.stub(server, 'use', function(callback) {
			callback(req, {}, function () {});
			consoleLog.should.have.been.calledWith(LoggerRoute.PREFIX, ip, address);
		});

		LoggerRoute(server);
	});

	it ('should invoke the "next" callback argument', function () {
		var next = sandbox.stub();
		var req = generateRequest();
		sandbox.stub(server, 'use', function(callback) {
			callback(req, {}, next);
		});

		LoggerRoute(server);
	});
});
