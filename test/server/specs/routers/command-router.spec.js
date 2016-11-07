var sinon = require('sinon');

var Socket = require('./../../mockups/socket.mock');

var EventManager = require('./../../mockups/services/event-manager.mock');
var DataStorage = require('./../../mockups/services/data-storage.mock');
var Cypher = require('./../../mockups/services/cypher.mock');
var UsersModel = require('./../../mockups/models/users-model.mock');
var DataRouter = require('./../../mockups/data-router.mock');

var PongRoute = require('./../../mockups/routers/commands/pong-route.mock');
var AuthenticationRoute = require('./../../mockups/routers/commands/authentication-route.mock');
var ReconnectionRoute = require('./../../mockups/routers/commands/reconnection-route.mock');
var UnknownRoute = require('./../../mockups/routers/commands/unknown-route.mock');

var SocketEvent = require('./../../../../src/server/events/socket-event');

describe('The Commands Router class', function () {
	var CommandsRouter, sandbox, eventManager, dataStorage, cypher, usersModel, socket;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		eventManager = new EventManager();
		dataStorage = new DataStorage();
		cypher = new Cypher();
		usersModel = new UsersModel();
		socket = new Socket();
		dataStorage.getModel = function () {
			return usersModel;
		};

		PongRoute.mockStart();
		AuthenticationRoute.mockStart();
		ReconnectionRoute.mockStart();
		UnknownRoute.mockStart();
		DataRouter.mockStart();

		CommandsRouter = require('./../../../../src/server/routers/commands-router');
	});

	afterEach(function () {
		DataRouter.mockStop();
		UnknownRoute.mockStop();
		ReconnectionRoute.mockStop();
		AuthenticationRoute.mockStop();
		PongRoute.mockStop();

		EventManager.restore();
		DataStorage.restore();
		Cypher.restore();
		UsersModel.restore();
		sandbox.restore();
	});

	it('should be a function', function () {
		CommandsRouter.should.be.a('function');
	});

	it('should create a PongRoute when created', function () {
		var instance = new CommandsRouter(eventManager, dataStorage, cypher);

		PongRoute.should.have.been.calledOnce;
	});

	it('should create an AuthenticationRoute when created', function () {
		var instance = new CommandsRouter(eventManager, dataStorage, cypher);

		AuthenticationRoute.should.have.been.calledOnce;
	});

	it('should create an ReconnectionRoute when created', function () {
		var instance = new CommandsRouter(eventManager, dataStorage, cypher);

		ReconnectionRoute.should.have.been.calledOnce;
	});

	it('should create an UnknownRoute when created', function () {
		var instance = new CommandsRouter(eventManager, dataStorage, cypher);

		UnknownRoute.should.have.been.calledOnce;
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new CommandsRouter(eventManager, dataStorage, cypher);
		});

		it('should be an instance of CommandsRouter', function () {
			instance.should.be.an.instanceOf(CommandsRouter);
		});

		it('should only initialize once', function () {
			var spy = sandbox.spy(eventManager, 'on');

			instance.initialize();
			instance.initialize();

			spy.should.have.been.calledWith('socket.message').and.calledOnce;
		});

		it('should register the PongRoute with the expected command', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'register');
			var expectedCommand = 'pong';

			instance.initialize();

			spy.should.have.been.calledWith('command', expectedCommand, PongRoute.getInstance().execute);
		});

		it('should register the AuthenticationRoute with the expected command', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'register');
			var expectedCommand = 'authentication';

			instance.initialize();

			spy.should.have.been.calledWith('command', expectedCommand, AuthenticationRoute.getInstance().execute);
		});

		it('should register the ReconnectionRoute with the expected command', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'register');
			var expectedCommand = 'reconnection';

			instance.initialize();

			spy.should.have.been.calledWith('command', expectedCommand, ReconnectionRoute.getInstance().execute);
		});

		it('should register the UnknownRoute', function () {
			var spy = sandbox.spy(DataRouter.getInstance(), 'register');

			instance.initialize();

			spy.should.have.been.calledWith(UnknownRoute.getInstance().execute);
		});

		describe('after initializing', function () {

			beforeEach(function () {
				instance.initialize();
			});

			it('should use the DataRouter to resolve commands from a message when a socket receives a it', function () {
				var spy = sandbox.spy(DataRouter.getInstance(), 'resolve');
				var message = {command: 'bogus'};
				var expectedData = {
					command: message.command,
					message: message,
					socket: socket
				};
				eventManager.emit(SocketEvent.MESSAGE, socket, JSON.stringify(message));

				spy.should.have.been.calledWith(expectedData).and.calledOnce;
			});
		});
	});
});