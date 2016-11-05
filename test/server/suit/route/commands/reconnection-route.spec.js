var sinon = require('sinon');

var EventManager = require('./../../../mockups/service/event-manager.mock');
var UsersModel = require('./../../../mockups/model/users-model.mock');
var DataStorage = require('./../../../mockups/service/data-storage.mock');

describe('The Reconnection Route class', function () {
	var ReconnectionRoute, sandbox, username, password, token, eventManager, dataStorage, usersModel, user;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		username =  'username';
		password = 'password';
		token = 'token';

		eventManager = new EventManager();
		usersModel = new UsersModel();
		dataStorage = new DataStorage();
		dataStorage.getModel = function () {
			return usersModel;
		};

		ReconnectionRoute = require('./../../../../../src/server/route/commands/reconnection-route');
	});

	afterEach(function () {
		EventManager.restore();
		UsersModel.restore();
		DataStorage.restore();
		sandbox.restore();
	});

	it('should be a function', function () {
		ReconnectionRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			user = { username: username, password: password, token: token};
			instance = new ReconnectionRoute(eventManager, dataStorage);
		});

		it('should be an instance of ReconnectionRoute', function () {
			instance.should.be.an.instanceOf(ReconnectionRoute);
		});

		it('should send the expected message to the data socket when reconnection fails', function () {
			var expectedMessage = JSON.stringify({ command: 'reconnection', valid: false});
			var spy = sandbox.spy();
			var data = {
				_socket: {
					send: spy
				}
			};

			UsersModel.addResponse(null, null);

			return instance.execute(data).then(function () {
				spy.should.have.been.calledWith(expectedMessage);
			});
		});

		it('should send the expected message to the data socket when reconnection succeeds', function () {
			var expectedMessage = JSON.stringify({ command: 'reconnection', valid: true});
			var spy = sandbox.spy();
			var data = {
				_socket: {
					send: spy
				}
			};

			UsersModel.addResponse(null, user);
			UsersModel.addResponse(null, [user]);

			return instance.execute(data).then(function () {
				spy.should.have.been.calledWith(expectedMessage);
			});
		});
	});
});