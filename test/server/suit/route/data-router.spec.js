var sinon = require('sinon');

var Socket = require('./../../mockups/socket.mock');
var EventManager = require('./../../mockups/component/event-manager.mock');
var DataStorage = require('./../../mockups/component/data-storage.mock');
var Cypher = require('./../../mockups/component/cypher.mock');
var UsersModel = require('./../../mockups/model/users-model.mock');
var DataRouterModule = require('./../../mockups/data-router.mock');

var PongRoute = require('./../../mockups/route/data/pong-route.mock');
var AuthenticationRoute = require('./../../mockups/route/data/authentication-route.mock');
var ReconnectionRoute = require('./../../mockups/route/data/reconnection-route.mock');
var UnknownRoute = require('./../../mockups/route/data/unknown-route.mock');

var SocketEvent = require('./../../../../src/server/event/socket-event');

describe('The Data Router class', function () {
	var DataRouter, sandbox, eventManager, dataStorage, cypher, usersModel, socket;

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
		DataRouterModule.mockStart();

		DataRouter = require('./../../../../src/server/route/data-router');
	});

	afterEach(function () {
		DataRouterModule.mockStop();
		UnknownRoute.mockStop();
		ReconnectionRoute.mockStop();
		AuthenticationRoute.mockStop();
		PongRoute.mockStop();

		sandbox.restore();
	});

	it('should be a function', function () {
		DataRouter.should.be.a('function');
	});

	it('should create a PongRoute when created', function () {
		var instance = new DataRouter(eventManager, dataStorage, cypher);

		PongRoute.should.have.been.calledOnce;
	});

	it('should create an AuthenticationRoute when created', function () {
		var instance = new DataRouter(eventManager, dataStorage, cypher);

		AuthenticationRoute.should.have.been.calledOnce;
	});

	it('should create an ReconnectionRoute when created', function () {
		var instance = new DataRouter(eventManager, dataStorage, cypher);

		ReconnectionRoute.should.have.been.calledOnce;
	});

	it('should create an UnknownRoute when created', function () {
		var instance = new DataRouter(eventManager, dataStorage, cypher);

		UnknownRoute.should.have.been.calledOnce;
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new DataRouter(eventManager, dataStorage, cypher);
		});

		it('should be an instance of DataRouter', function () {
			instance.should.be.an.instanceOf(DataRouter);
		});

		it('should only initialize once', function () {
			var spy = sandbox.spy(eventManager, 'on');

			instance.initialize();
			instance.initialize();

			spy.should.have.been.calledWith('socket.message').and.calledOnce;
		});

		it('should register the PongRoute with the expected command', function () {
			var spy = sandbox.spy(DataRouterModule.getInstance(), 'register');
			var expectedCommand = 'pong';

			instance.initialize();

			spy.should.have.been.calledWith('command', expectedCommand, PongRoute.getInstance().execute);
		});

		it('should register the AuthenticationRoute with the expected command', function () {
			var spy = sandbox.spy(DataRouterModule.getInstance(), 'register');
			var expectedCommand = 'authentication';

			instance.initialize();

			spy.should.have.been.calledWith('command', expectedCommand, AuthenticationRoute.getInstance().execute);
		});

		it('should register the ReconnectionRoute with the expected command', function () {
			var spy = sandbox.spy(DataRouterModule.getInstance(), 'register');
			var expectedCommand = 'reconnection';

			instance.initialize();

			spy.should.have.been.calledWith('command', expectedCommand, ReconnectionRoute.getInstance().execute);
		});

		it('should register the UnknownRoute', function () {
			var spy = sandbox.spy(DataRouterModule.getInstance(), 'register');

			instance.initialize();

			spy.should.have.been.calledWith(UnknownRoute.getInstance().execute);
		});

		describe('after initializing', function () {

			beforeEach(function () {
				instance.initialize();
			});

			it('should use the DataRouter to resolve commands from a message when a socket receives a it', function () {
				var spy = sandbox.spy(DataRouterModule.getInstance(), 'resolve');
				var expectedData = {command: 'bogus'};
				eventManager.emit(SocketEvent.MESSAGE, socket, JSON.stringify(expectedData));

				expectedData._socket = socket;
				spy.should.have.been.calledWith(expectedData);
			});
		});
	});
});