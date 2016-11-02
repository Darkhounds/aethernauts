var sinon = require('sinon');

var Socket = require('./../../mockups/socket.mock');
var EventManager = require('./../../mockups/component/event-manager.mock');
var UsersModel = require('./../../mockups/model/users-model.mock');
var DataStorage = require('./../../mockups/component/data-storage.mock');
var Cypher = require('./../../mockups/component/cypher.mock');

var AuthenticationRoute = require('./../../mockups/route/data/authentication-route.mock');
var ReconnectionRoute = require('./../../mockups/route/data/reconnection-route.mock');
var UnknownRoute = require('./../../mockups/route/data/unknown-route.mock');

var SocketEvent = require('./../../../../src/server/event/socket-event');

describe('The Data Router class', function () {
	var DataRouter, sandbox, consoleLog, cypher, eventManager, dataStorage, usersModel;

	beforeEach(function () {
		cypher = new Cypher();
		sandbox = sinon.sandbox.create();
		consoleLog = sandbox.stub(console, 'log');
		AuthenticationRoute.mockStart();
		ReconnectionRoute.mockStart();
		UnknownRoute.mockStart();
		eventManager = new EventManager();
		usersModel = new UsersModel();
		dataStorage = new DataStorage();
		dataStorage.getModel = function () {
			return usersModel;
		};
		DataRouter = require('./../../../../src/server/route/data-router');
	});

	afterEach(function () {
		UnknownRoute.mockStop();
		ReconnectionRoute.mockStop();
		AuthenticationRoute.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		DataRouter.should.be.a('function');
	});

	it('should create an AuthenticationRoute when created', function () {
		var instance = new DataRouter(eventManager, dataStorage);

		AuthenticationRoute.should.have.been.calledOnce;
	});

	it('should create an ReconnectionRoute when created', function () {
		var instance = new DataRouter(eventManager, dataStorage);

		ReconnectionRoute.should.have.been.calledOnce;
	});

	it('should create an UnknownRoute when created', function () {
		var instance = new DataRouter(eventManager, dataStorage);

		UnknownRoute.should.have.been.calledOnce;
	});

	describe('as an instance', function () {
		var instance, socket;

		beforeEach(function () {
			socket = new Socket();
			instance = new DataRouter(eventManager, dataStorage);
		});

		it('should be an instance of DataRouter', function () {
			instance.should.be.an.instanceOf(DataRouter);
		});

		it('should setup the AuthenticationRoute with the Cypher instance on setup', function () {
			var spy = sandbox.spy(AuthenticationRoute.prototype, 'setup');

			instance.setup(cypher);

			spy.should.have.been.calledWith(cypher);
		});

		describe('after setup', function () {

			beforeEach(function () {
				instance.setup(cypher);
			});

			it('should output the expected message when a socket is opened', function () {
				eventManager.emit(SocketEvent.OPENED, socket);

				consoleLog.should.have.been.calledWith(DataRouter.CONNECTION_OPENED, socket.upgradeReq.connection.remoteAddress);
			});

			it('should create and register a new mask on it self when a socket is opened', function () {
				var expectedMask = 'bogusMask';

				Cypher.addResponse(expectedMask);
				eventManager.emit(SocketEvent.OPENED, socket);

				socket.mask.should.equal(expectedMask);
			});

			it('should send an handshake command with the degenerated mask when a socket is opened', function () {
				var spy = sandbox.spy(socket, 'send');
				var mask = 'bogusMask';
				var expectedMessage = JSON.stringify({command: 'handshake', mask: mask});

				Cypher.addResponse(mask);
				eventManager.emit(SocketEvent.OPENED, socket);

				spy.should.have.been.calledWith(expectedMessage).once;
			});

			it('should output the expected message when a socket receives a message', function () {
				var message = JSON.stringify({type: 'bogus'});
				eventManager.emit(SocketEvent.MESSAGE, socket, message);

				consoleLog.should.have.been.calledWith(DataRouter.MESSAGE_RECEIVED, socket.upgradeReq.connection.remoteAddress, message);
			});

			it('should output the expected message when a socket is closed', function () {
				eventManager.emit(SocketEvent.CLOSED, socket);

				consoleLog.should.have.been.calledWith(DataRouter.CONNECTION_CLOSED, socket.upgradeReq.connection.remoteAddress);
			});
		});
	});
});