var sinon = require('sinon');

var Socket = require('./../../../mockups/socket.mock');
var DataRouter = require('./../../../mockups/data-router.mock');
var AuthenticationRoute = require('./../../../mockups/component/sockets-router/authentication-route.mock');
var ReconnectionRoute = require('./../../../mockups/component/sockets-router/reconnection-route.mock');
var UnknownRoute = require('./../../../mockups/component/sockets-router/unknown-route.mock');

describe('The Sockets Router class', function () {
	var APIRouter, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		DataRouter.mockStart();
		AuthenticationRoute.mockStart();
		ReconnectionRoute.mockStart();
		UnknownRoute.mockStart();
		APIRouter = require('./../../../../../src/server/component/sockets-router/sockets-router');
	});
	afterEach(function () {
		UnknownRoute.mockStop();
		ReconnectionRoute.mockStop();
		AuthenticationRoute.mockStop();
		DataRouter.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		APIRouter.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, socket;

		beforeEach(function () {
			instance = new APIRouter();
			socket = new Socket();
		});
		afterEach(function () {
			instance = null;
		});

		it('should register a route to the property "command" with value "authentication" when invoking the addAuthentication method', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'register');

			instance.addAuthentication();

			spy.should.have.been.calledWith('command', 'authentication').once;
		});

		it('should register a route to the property "command" with value "reconnection" when invoking the addReconnection method', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'register');

			instance.addReconnection();

			spy.should.have.been.calledWith('command', 'reconnection').once;
		});

		it('should register a default unknown route when invoking the addUnknownCommand method', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'register');

			instance.addUnknownCommand();

			spy.getCall(0).args.length.should.equal(1);
		});

		it('should bind the "AuthenticationRoute" with the expected socket and model when invoking the addAuthentication method', function () {
			var spy = sandbox.spy(AuthenticationRoute, 'bind');
			var model = {};

			instance.addAuthentication(model);

			spy.should.have.been.calledWith(instance, model).once;
		});

		it('should bind the "ReconnectionRoute" with the expected socket and model when invoking the addReconnection method', function () {
			var spy = sandbox.spy(ReconnectionRoute, 'bind');
			var model = {};

			instance.addReconnection(model);

			spy.should.have.been.calledWith(instance, model).once;
		});

		it('should bind the "UnknownRoute" with the expected socket when invoking the addUnknown method', function () {
			var spy = sandbox.spy(UnknownRoute, 'bind');

			instance.addUnknownCommand();

			spy.should.have.been.calledWith(instance).once;
		});

		it('should listen to message events on socket registration', function () {
			var spy = sandbox.spy(socket, 'on');

			instance.registerSocket(socket);

			spy.should.have.been.calledWith('message').once;
		});

		it('should listen to close events on socket registration', function () {
			var spy = sandbox.spy(socket, 'on');

			instance.registerSocket(socket);

			spy.should.have.been.calledWith('close').once;
		});

		it('should stop listening to message events when the socket closes', function () {
			var spy = sandbox.spy(socket, 'removeListener');

			instance.registerSocket(socket);
			socket.emit('close');

			spy.should.have.been.calledWith('message').once;
		});

		it('should stop listening to close events when the socket closes', function () {
			var spy = sandbox.spy(socket, 'removeListener');

			instance.registerSocket(socket);
			socket.emit('close');

			spy.should.have.been.calledWith('close').once;
		});

		it('should use the data-router to resolve socket messages', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'resolve');
			var data = {foo: 'bar'};

			instance.registerSocket(socket);
			socket.emit('message', JSON.stringify(data));

			spy.should.have.been.calledOnce
		});

		it('should convert the json message into an object when passing it to the data-router', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'resolve');
			var data = {foo: 'bar'};

			instance.registerSocket(socket);
			socket.emit('message', JSON.stringify(data));
			data._socket = socket;

			spy.getCall(0).args[0].should.eql(data);
		});
	});
});
