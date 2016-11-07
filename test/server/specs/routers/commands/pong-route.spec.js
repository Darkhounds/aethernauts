var sinon = require('sinon');

var EventManager = require('./../../../mockups/services/event-manager.mock');
var Socket = require('./../../../mockups/socket.mock');

var SocketEvent = require('./../../../../../src/server/events/socket-event');

describe('The Pong Route class', function() {
	var PongRoute, sandbox, eventManager, socket;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		socket = new Socket();
		eventManager = new EventManager();

		PongRoute = require('./../../../../../src/server/routers/commands/pong-route');
	});

	afterEach(function () {
		EventManager.restore();

		sandbox.restore();
	});

	it('should be a function', function () {
		PongRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new PongRoute(eventManager);
		});

		it('should be an instance of PongRoute', function () {
			instance.should.be.an.instanceOf(PongRoute);
		});

		it('should invoke the send method', function () {
			var spy = sandbox.spy(eventManager, 'emit');
			var data = {};

			return instance.execute(data, socket).then(function () {
				spy.should.have.been.calledWith(SocketEvent.PONG, socket).and.calledOnce;
			});
		});
	});
});