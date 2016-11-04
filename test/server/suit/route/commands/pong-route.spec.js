var sinon = require('sinon');

var EventManager = require('./../../../mockups/component/event-manager.mock');
var Socket = require('./../../../mockups/socket.mock');

var SocketEvent = require('./../../../../../src/server/event/socket-event');

describe('The Pong Route class', function() {
	var PongRoute, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		PongRoute = require('./../../../../../src/server/route/commands/pong-route');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		PongRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, eventManager, socket;

		beforeEach(function () {
			socket = new Socket();
			eventManager = new EventManager();
			instance = new PongRoute(eventManager);
		});

		it('should be an instance of PongRoute', function () {
			instance.should.be.an.instanceOf(PongRoute);
		});

		it('should invoke the send method of the data socket', function () {
			var spy = sandbox.spy(eventManager, 'emit');
			var data = { _socket: socket };

			return instance.execute(data).then(function () {
				spy.should.have.been.calledWith(SocketEvent.PONG, socket).calledTOnce;
			});
		});
	});
});