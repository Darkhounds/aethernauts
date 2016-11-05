var sinon = require('sinon');

var Socket = require('./../../../mockups/socket.mock');
var EventManager = require('./../../../mockups/service/event-manager.mock');

var SocketEvent = require('./../../../../../src/server/event/socket-event');

describe('The Websocket Route class', function () {
	var WebsocketRoute, sandbox, eventManager;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		eventManager = new EventManager();

		WebsocketRoute = require('./../../../../../src/server/route/statics/websocket-route');
	});

	afterEach(function () {
		EventManager.restore();
		sandbox.restore();
	});

	it('should be a function', function () {
		WebsocketRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
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
