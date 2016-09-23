var sinon = require('sinon');

var Socket = require('./../../../mockups/socket.mock');
var UserModel = require('./../../../mockups/model/users-model.mock');

describe('The AuthenticationRoute class', function () {
	var AuthenticationRoute, sandbox, model, socket;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		UserModel.mockStart();
		model = new UserModel();
		socket = new Socket();
		AuthenticationRoute = require('./../../../../../src/server/component/sockets-router/authentication-route');
	});
	afterEach(function () {
		socket = null;
		UserModel.mockStop();
		sandbox.restore();
	});

	it ('should be a function', function () {
		AuthenticationRoute.should.be.a('function');
	});

	describe('when authenticating', function () {
		var username = 'username';
		var password = 'password';

		it ('should retrieve the user from the model by its username and password', function (done) {
			var spy = sandbox.spy(model, 'findOne');

			AuthenticationRoute(model, { _socket: socket, username: username, password: password }).finally(function () {
				spy.getCall(0).args[0].should.eql({ username: username, password: password });
				done();
			});
		});

		it ('should update the user on the model with the new token', function (done) {
			var spy = sandbox.spy(model, 'update');

			UserModel.addResponse(null, {});
			UserModel.addResponse(null, {});
			AuthenticationRoute(model, { _socket: socket, username: username, password: password }).finally(function () {
				spy.getCall(0).args[1].should.eql({token: 'bogus' });
				done();
			});
		});

		it ('should send a invalidated authentication object back to the socket when authentication fails', function (done) {
			var spy = sandbox.spy(socket, 'send');
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: false})

			UserModel.addResponse(null);
			AuthenticationRoute(model, { _socket: socket, username: username, password: password }).finally(function () {
				spy.getCall(0).args[0].should.eql(expectedMessage);
				done();
			});
		});

		it ('should send a validated authentication object back to the socket when authentication succeeds', function (done) {
			var spy = sandbox.spy(socket, 'send');
			var expectedMessage = JSON.stringify({ command: 'authentication', valid: true, token: 'bogus' });

			UserModel.addResponse(null, {});
			UserModel.addResponse(null, [{token: 'bogus'}]);
			AuthenticationRoute(model, { _socket: socket, username: username, password: password }).finally(function () {
				spy.getCall(0).args[0].should.eql(expectedMessage);
				done();
			});
		});

		it ('should upgrade the socket to have the username stored after successfully authenticate', function (done) {
			UserModel.addResponse(null, {});
			UserModel.addResponse(null, [{ username: username, token: 'bogus' }]);
			AuthenticationRoute(model, { _socket: socket, username: username, password: password }).finally(function () {
				socket.user.should.eql({ username: username });
				done();
			});
		});
	});
});
