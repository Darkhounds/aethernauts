var sinon = require('sinon');

var Socket = require('./../../mockups/socket.mock');
var EventManager = require('./../../mockups/component/event-manager.mock');
var UsersModel = require('./../../mockups/model/users-model.mock');
var DataStorage = require('./../../mockups/component/data-storage.mock');
var ServerConfig = require('./../../mockups/object/server-config.mock');

var AuthenticationRoute = require('./../../mockups/route/data/authentication-route.mock');
var ReconnectionRoute = require('./../../mockups/route/data/reconnection-route.mock');
var UnknownRoute = require('./../../mockups/route/data/unknown-route.mock');

var SocketEvent = require('./../../../../src/server/event/socket-event');

describe('The Data Router class', function () {
	var DataRouter, sandbox, consoleLog, config;

	beforeEach(function () {
		config = new ServerConfig();
		sandbox = sinon.sandbox.create();
		consoleLog = sandbox.stub(console, 'log');
		AuthenticationRoute.mockStart();
		ReconnectionRoute.mockStart();
		UnknownRoute.mockStart();
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

	describe('as an instance', function () {
		var instance, eventManager, dataStorage, usersModel, socket;

		beforeEach(function () {
			socket = new Socket();
			eventManager = new EventManager();
			usersModel = new UsersModel();
			dataStorage = new DataStorage();
			dataStorage.getModel = function () {
				return usersModel;
			};
			instance = new DataRouter(eventManager, dataStorage);
		});

		it('should be an instance of DataRouter', function () {
			instance.should.be.an.instanceOf(DataRouter);
		});

		describe('after setup', function () {

			beforeEach(function () {
				instance.setup(config);
			});

			it('should output the expected message when a socket is opened', function () {
				eventManager.emit(SocketEvent.OPENED, socket);

				consoleLog.should.have.been.calledWith(DataRouter.CONNECTION_OPENED, socket.upgradeReq.connection.remoteAddress);
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