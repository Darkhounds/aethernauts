var sinon = require('sinon');

var connectionEvent = require('./../../../../src/client/js/event/connection-events');
var connectionService = require('./../../mockups/service/connection-service.mock');

var LoginView = require('./../../mockups/view/login-view.mock');
var LogoutView = require('./../../mockups/view/logout-view.mock');

describe('The AuthenticationController class', function () {
	var AuthenticationController, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		LoginView.mockStart();
		LogoutView.mockStart();
		connectionService.mockStart();
		AuthenticationController = require('./../../../../src/client/js/controller/authentication-controller');
		context = document.createElement('div');
	});
	afterEach(function() {
		connectionService.mockStop();
		LogoutView.mockStop();
		LoginView.mockStop();
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance, username, password;

		beforeEach(function () {
			username = 'foo';
			password = 'bar';
			instance = new AuthenticationController();
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "AuthenticationController"', function () {
			instance.should.be.an.instanceof(AuthenticationController);
		});

		it ('should render the Login view when setting the context', function () {
			var spy = sandbox.spy(LoginView.getInstance(), 'render');

			instance.setContext(context);

			spy.should.have.been.calledWith(context);
		});

		it ('should output a console error on a connection error', function () {
			var error = 'bogus';
			var spy = sandbox.stub(console, 'error');

			connectionService.getInstance().emit(connectionEvent.CONNECTION_ERROR, error);

			spy.should.have.been.calledWith(error);
		});

		it ('should output a console error on an authentication error', function () {
			var error = 'bogus';
			var spy = sandbox.stub(console, 'error');

			connectionService.getInstance().emit(connectionEvent.AUTHENTICATION_ERROR, error);

			spy.should.have.been.calledWith(error);
		});

		it ('should handle a login view authenticate event', function () {
			var spy = sandbox.spy(connectionService.getInstance(), 'open');

			LoginView.getInstance().emit('authenticate', username, password);

			spy.should.have.been.calledWith(username, password);
		});

		it ('should render the Logout view after connecting', function () {
			var spy = sandbox.spy(LogoutView.getInstance(), 'render');

			instance.setContext(context);
			connectionService.getInstance().emit(connectionEvent.OPENED);

			spy.should.have.been.calledWith(context);
		});

		it ('should add the disconnected class to the context on connection service disconnected event', function () {
			var spy = sandbox.spy(context.classList, 'add');

			instance.setContext(context);
			connectionService.getInstance().emit(connectionEvent.DISCONNECTED);

			spy.should.have.been.calledWith('disconnected');
		});

		it ('should remove the disconnected class from the context on connection service reconnected event', function () {
			var spy = sandbox.spy(context.classList, 'remove');

			instance.setContext(context);
			connectionService.getInstance().emit(connectionEvent.RECONNECTED);

			spy.should.have.been.calledWith('disconnected');
		});

		it ('should handle a logout view disconnect event', function () {
			var spy = sandbox.spy(connectionService.getInstance(), 'close');

			LogoutView.getInstance().emit('disconnect');

			spy.should.have.been.calledOnce;
		});

		it ('should render the Login view after disconnecting', function () {
			instance.setContext(context);

			var spy = sandbox.spy(LoginView.getInstance(), 'render');

			connectionService.getInstance().emit(connectionEvent.CLOSED);

			spy.should.have.been.calledWith(context);
		});
	});
});
