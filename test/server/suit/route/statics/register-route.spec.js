var sinon = require('sinon');

var Cypher = require('./../../../mockups/component/cypher.mock');

var UsersModel = require('./../../../mockups/model/users-model.mock');
var DataStorage = require('./../../../mockups/component/data-storage.mock');

describe('The Register Route class', function () {
	var RegisterRoute, sandbox, email, username, password, character, token, dataStorage, cypher, usersModel, config, req;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		email = 'something@somewhere.com';
		username = 'username';
		password = 'password';
		character = 'character';
		token = 'token';
		dataStorage = new DataStorage();
		cypher = new Cypher();
		usersModel = new UsersModel();
		dataStorage.getModel = function () {
			return usersModel;
		};
		config = {
			index: 'bogus'
		};
		req = {
			body: {
				email: email,
				username: username,
				password: password,
				character: character
			}
		};

		DataStorage.mockStart();
		UsersModel.mockStart();

		RegisterRoute = require('./../../../../../src/server/route/statics/register-route');
	});

	afterEach(function () {
		UsersModel.mockStop();
		DataStorage.mockStart();

		sandbox.restore();
	});

	it('should be a function', function () {
		RegisterRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new RegisterRoute(dataStorage, cypher);
		});

		it('should be an instance of RegisterRoute', function () {
			instance.should.be.an.instanceOf(RegisterRoute);
		});

		it('should encrypt the password', function () {
			var encryptedPassword = 'encryptedPassword';
			var expectedData = {
				email: email,
				username: username,
				password: encryptedPassword,
				character: character,
				type: 'user',
				token: 'bogus'
			};
			var spy = sandbox.spy(UsersModel.getInstance(), 'create');
			var res = {
				end: function () {}
			};

			Cypher.addResponse(encryptedPassword);
			UsersModel.addResponse(null, []);
			UsersModel.addResponse(null, {token: token});

			return instance.execute(req, res).finally(function () {
				spy.should.have.been.calledWith(expectedData);
			});
		});

		it('should send a valid response with the expected values', function () {
			var expected = JSON.stringify({command: 'registration', valid: true, token: token});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, []);
			UsersModel.addResponse(null, {token: token});

			return instance.execute(req, res).then(function () {
				spy.should.have.been.calledWith(expected);
			});
		});

		it('should send an invalid response with the email as error', function () {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['email']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{email: email}]);

			return instance.execute(req, res).then(function () {
				spy.should.have.been.calledWith(expected);
			});
		});

		it('should send an invalid response with the username as error', function () {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['username']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{username: username}]);

			instance.execute(req, res).then(function () {
				spy.should.have.been.calledWith(expected);
			});
		});

		it('should send an invalid response with the character as error', function () {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['character']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{character: character}]);

			instance.execute(req, res).then(function () {
				spy.should.have.been.calledWith(expected);
			});
		});

		it('should send an invalid response with the email, username and character as error', function () {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['email', 'username', 'character']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{email: email, username: username, character: character}]);

			instance.execute(req, res).then(function () {
				spy.should.have.been.calledWith(expected);
			});
		});
	});
});
