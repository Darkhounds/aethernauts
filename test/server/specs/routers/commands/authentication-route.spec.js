var sinon = require('sinon');

var Cypher = require('./../../../mockups/services/cypher.mock');
var EventManager = require('./../../../mockups/services/event-manager.mock');
var Socket = require('./../../../mockups/socket.mock');
var UsersModel = require('./../../../mockups/models/users-model.mock');
var DataStorage = require('./../../../mockups/services/data-storage.mock');

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

		AuthenticationRoute = require('./../../../../../src/server/routers/commands/authentication-route');
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
				username: username,
				password: password
			};

			Cypher.addResponse(expectedPassword);
			Cypher.addResponse(expectedPassword);
			Cypher.addResponse(expectedPassword);
			instance.execute(data, socket);

			spy.should.have.been.calledWith({ username: username, password: expectedPassword }).and.calledOnce;
		});

		it('should send the expected message when authentication fails', function () {
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: false});
			var spy = sandbox.spy(socket, 'send');
			var data = {
				username: username
			};

			UsersModel.addResponse(null, null);

			return instance.execute(data, socket).then(function () {
				spy.should.have.been.calledWith(expectedMessage).and.calledOnces;
			});
		});

		it('should send the expected message when authentication succeeds', function () {
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: true, token: user.token });
			var spy = sandbox.spy(socket, 'send');
			var data = {
				username: username
			};

			UsersModel.addResponse(null, user);
			UsersModel.addResponse(null, [user]);

			return instance.execute(data, socket).then(function () {
				spy.should.have.been.calledWith(expectedMessage).and.calledOnce;
			});
		});
	});
});