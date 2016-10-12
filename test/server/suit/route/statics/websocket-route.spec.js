var sinon = require('sinon');

var Socket = require('./../../../mockups/socket.mock');
var EventManager = require('./../../../mockups/component/event-manager.mock');

var SocketEvent = require('./../../../../../src/server/event/socket-event');

describe('The Websocket Route class', function () {
	var WebsocketRoute, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		WebsocketRoute = require('./../../../../../src/server/route/statics/websocket-route');
	});

	it('should be a function', function () {
		WebsocketRoute.should.be.a('function');
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance, eventManager;

		beforeEach(function () {
			eventManager = new EventManager();
			instance = new WebsocketRoute(eventManager);
		});

		it('should be an instance of WebsocketRoute', function () {
			instance.should.be.an.instanceOf(WebsocketRoute);
		});

		it('should trigger a socket open event on the eventManager when executing', function () {
			var spy = sandbox.spy(eventManager, 'emit');
			var socket = new Socket();

			instance.execute(socket);

			spy.should.have.been.calledWith(SocketEvent.OPENED, socket);
		});

		it('should trigger a socket close event when a socket closes', function () {
			var spy = sandbox.spy(eventManager, 'emit');
			var socket = new Socket();

			instance.execute(socket);
			socket.emit('close');

			spy.should.have.been.calledWith(SocketEvent.CLOSED, socket);
		});

		it('should trigger a socket message event on a socket message event', function () {
			var spy = sandbox.spy(eventManager, 'emit');
			var socket = new Socket();
			var message = 'bogus';

			instance.execute(socket);
			socket.emit('message', message);

			spy.should.have.been.calledWith(SocketEvent.MESSAGE, socket, message);
		});
	});
});
