var sinon = require('sinon');

var UsersModel = require('./../../../mockups/model/users-model.mock');
var DataStorage = require('./../../../mockups/component/data-storage.mock');

describe('The Register Route class', function () {
	var RegisterRoute, sandbox;
	var email = 'something@somewhere.com';
	var username = 'username';
	var password = 'password';
	var character = 'character';
	var token = 'token';

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
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
		var instance, config, usersModel, dataStorage, req;

		beforeEach(function () {
			usersModel = new UsersModel();
			dataStorage = new DataStorage();
			dataStorage.getModel = function () {
				return usersModel;
			};

			config = {
				index: 'bogus'
			};
			instance = new RegisterRoute(dataStorage);
			instance.setup(config);

			req = {
				body: {
					email: email,
					username: username,
					password: password,
					character: character
				}
			};
		});

		it('should be an instance of RegisterRoute', function () {
			instance.should.be.an.instanceOf(RegisterRoute);
		});
		
		it('should send a valid response with the expected values', function (done) {
			var expected = JSON.stringify({command: 'registration', valid: true, token: token});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, []);
			UsersModel.addResponse(null, {token: token});

			instance.execute(req, res)
				.finally(function () {
					spy.should.have.been.calledWith(expected).once;
					done();
				});
		});

		it('should send an invalid response with the email as error', function (done) {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['email']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{email: email}]);

			instance.execute(req, res)
				.finally(function () {
					spy.should.have.been.calledWith(expected).once;
					done();
				});
		});

		it('should send an invalid response with the username as error', function (done) {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['username']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{username: username}]);

			instance.execute(req, res)
				.finally(function () {
					spy.should.have.been.calledWith(expected).once;
					done();
				});
		});

		it('should send an invalid response with the character as error', function (done) {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['character']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{character: character}]);

			instance.execute(req, res)
				.finally(function () {
					spy.should.have.been.calledWith(expected).once;
					done();
				});
		});

		it('should send an invalid response with the email, username and character as error', function (done) {
			var expected = JSON.stringify({command: 'registration', valid: false, errors: ['email', 'username', 'character']});
			var spy = sandbox.spy();
			var res = {
				end: spy
			};

			UsersModel.addResponse(null, [{email: email, username: username, character: character}]);

			instance.execute(req, res)
				.finally(function () {
					spy.should.have.been.calledWith(expected).once;
					done();
				});
		});
	});
});
