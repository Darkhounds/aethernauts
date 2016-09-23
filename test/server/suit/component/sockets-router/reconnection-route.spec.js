var sinon = require('sinon');

var Socket = require('./../../../mockups/socket.mock');
var UserModel = require('./../../../mockups/model/users-model.mock');

describe('The ReconnectionRoute class', function () {
	var AuthenticationRoute, sandbox, model, socket;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		UserModel.mockStart();
		model = new UserModel();
		socket = new Socket();
		AuthenticationRoute = require('./../../../../../src/server/component/sockets-router/reconnection-route');
	});
	afterEach(function () {
		socket = null;
		UserModel.mockStop();
		sandbox.restore();
	});

	it ('should be a function', function () {
		AuthenticationRoute.should.be.a('function');
	});

	describe('when reconnecting', function () {
		var username = 'username';
		var token = 'bogus';

		it ('should retrieve the user from the model by its username and token', function (done) {
			var spy = sandbox.spy(model, 'findOne');

			AuthenticationRoute(model, { _socket: socket, username: username, token: token }).finally(function () {
				spy.getCall(0).args[0].should.eql({ username: username, token: token });
				done();
			});
		});

		it ('should send a invalidated reconnection object back to the socket when it fails', function (done) {
			var spy = sandbox.spy(socket, 'send');
			var expectedMessage = JSON.stringify({ command: 'reconnection', valid: false });

			UserModel.addResponse(null);
			AuthenticationRoute(model, { _socket: socket, username: username, token: token }).finally(function () {
				spy.getCall(0).args[0].should.eql(expectedMessage);
				done();
			});
		});

		it ('should send a validated reconnection object back to the socket when it succeeds', function (done) {
			var spy = sandbox.spy(socket, 'send');
			var expectedMessage = JSON.stringify({ command: 'reconnection', valid: true });

			UserModel.addResponse(null, {});
			AuthenticationRoute(model, { _socket: socket, username: username, token: token }).finally(function () {

				spy.getCall(0).args[0].should.eql(expectedMessage);
				done();
			});
		});
	});
});
