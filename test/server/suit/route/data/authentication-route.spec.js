var sinon = require('sinon');

var EventManager = require('./../../../mockups/component/event-manager.mock');
var UsersModel = require('./../../../mockups/model/users-model.mock');
var DataStorage = require('./../../../mockups/component/data-storage.mock');

describe('The Authentication Route class', function() {
	var AuthenticationRoute, sandbox;
	var username =  'username';
	var password = 'password';
	var token = 'token';

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		AuthenticationRoute = require('./../../../../../src/server/route/data/authentication-route');
	});
	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		AuthenticationRoute.should.be.a('function');
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance, eventManager, dataStorage, usersModel, user;

		beforeEach(function () {
			user = { username: username, password: password, token: token};
			eventManager = new EventManager();
			usersModel = new UsersModel();
			dataStorage = new DataStorage();
			dataStorage.getModel = function () {
				return usersModel;
			};
			instance = new AuthenticationRoute(eventManager, dataStorage);
		});

		it('should be an instance of DataRoute', function () {
			instance.should.be.an.instanceOf(AuthenticationRoute);
		});

		it('should send the expected message to the data socket when authentication fails', function (done) {
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: false});
			var spy = sandbox.spy();
			var data = {
				username: username,
				_socket: {
					send: spy
				}
			};

			UsersModel.addResponse(null, null);

			instance.execute(data).finally(function () {
				spy.should.have.been.calledWith(expectedMessage);
				done();
			});
		});

		it('should send the expected message to the data socket when authentication succeeds', function (done) {
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: true, token: user.token });
			var spy = sandbox.spy();
			var data = {
				username: username,
				_socket: {
					send: spy
				}
			};

			UsersModel.addResponse(null, user);
			UsersModel.addResponse(null, [user]);

			instance.execute(data).finally(function () {
				spy.should.have.been.calledWith(expectedMessage);
				done();
			});
		});
	});
});