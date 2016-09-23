var sinon = require('sinon');

var Socket = require('./../../../mockups/socket.mock');

describe('The UnknownRoute class', function () {
	var UnknownRoute, sandbox, socket;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		socket = new Socket();
		UnknownRoute = require('./../../../../../src/server/component/sockets-router/unknown-route');
	});
	afterEach(function () {
		socket = null;
		sandbox.restore();
	});

	it ('should be a function', function () {
		UnknownRoute.should.be.a('function');
	});

	describe('when resolving', function () {
		it ('should send a invalidated reconnection object back to the socket when it fails', function (done) {
			var data = { _socket: socket, command: 'bogus' };
			var spy = sandbox.spy(socket, 'send');
			var expectedMessage = JSON.stringify({ command: 'error', code: 'unknownCommand', message: data.command});

			UnknownRoute(data).finally(function () {
				spy.getCall(0).args[0].should.eql(expectedMessage);
				done();
			});
		});
	});
});
