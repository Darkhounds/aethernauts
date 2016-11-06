var sinon = require('sinon');
var Socket = require('./../../../mockups/socket.mock');

describe('The Unknown Route class', function() {
	var DataRoute, sandbox, socket;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		socket = new Socket();

		DataRoute = require('./../../../../../src/server/route/commands/unknown-route');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		DataRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new DataRoute();
		});

		it('should be an instance of DataRoute', function () {
			instance.should.be.an.instanceOf(DataRoute);
		});

		it('should send the expected message', function () {
			var spy = sandbox.spy(socket, 'send');
			var message = {
				command: 'bogus'
			};
			var data = {
				message: message,
				socket: socket
			};
			var expectedMessage = JSON.stringify({ command: 'error', code:'unknownCommand', message: message.command })

			return instance.execute(data).then(function () {
				spy.should.have.been.calledWith(expectedMessage).and.calledOnce;
			});
		});
	});
});