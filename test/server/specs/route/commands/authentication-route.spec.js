var sinon = require('sinon');

var Cypher = require('./../../../mockups/service/cypher.mock');
var EventManager = require('./../../../mockups/service/event-manager.mock');
var Socket = require('./../../../mockups/socket.mock');
var UsersModel = require('./../../../mockups/model/users-model.mock');
var DataStorage = require('./../../../mockups/service/data-storage.mock');

describe('The Authentication Route class', function() {
	var AuthenticationRoute, sandbox, username, password, token, user, socket, eventManager, dataStorage, usersModel, cypher;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		username =  'username';
		password = 'password';
		token = 'token';

		socket = new Socket();
		eventManager = new EventManager();
		dataStorage = new DataStorage();
		usersModel = new UsersModel();
		cypher = new Cypher();

		dataStorage.getModel = function () {
			return usersModel;
		};
		user = { username: username, password: password, token: token};

		AuthenticationRoute = require('./../../../../../src/server/route/commands/authentication-route');
	});

	afterEach(function () {
		EventManager.restore();
		DataStorage.restore();
		UsersModel.restore();
		Cypher.restore();
		sandbox.restore();
	});

	it('should be a function', function () {
		AuthenticationRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new AuthenticationRoute(eventManager, dataStorage, cypher);
		});

		it('should be an instance of DataRoute', function () {
			instance.should.be.an.instanceOf(AuthenticationRoute);
		});

		it('should encrypt passwords before the database lookup', function () {
			var expectedPassword = 'encryptedPassword';
			var spy = sandbox.spy(UsersModel.getInstance(), 'findOne');
			var data = {
				message: {
					username: username,
					password: password
				},
				socket: socket
			};

			Cypher.addResponse(expectedPassword);
			Cypher.addResponse(expectedPassword);
			Cypher.addResponse(expectedPassword);
			instance.execute(data);

			spy.should.have.been.calledWith({ username: username, password: expectedPassword }).and.calledOnce;
		});

		it('should send the expected message when authentication fails', function () {
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: false});
			var spy = sandbox.spy(socket, 'send');
			var data = {
				message: {
					username: username
				},
				socket: socket
			};

			UsersModel.addResponse(null, null);

			return instance.execute(data).then(function () {
				spy.should.have.been.calledWith(expectedMessage).and.calledOnces;
			});
		});

		it('should send the expected message when authentication succeeds', function () {
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: true, token: user.token });
			var spy = sandbox.spy(socket, 'send');
			var data = {
				message: {
					username: username
				},
				socket: socket
			};

			UsersModel.addResponse(null, user);
			UsersModel.addResponse(null, [user]);

			return instance.execute(data).then(function () {
				spy.should.have.been.calledWith(expectedMessage).and.calledOnce;
			});
		});
	});
});