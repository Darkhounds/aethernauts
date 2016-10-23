var sinon = require('sinon');

var NotificationEvent = require('./../../../../src/client/js/event/notification-event');
var AuthenticationEvent = require('./../../../../src/client/js/event/authentication-event');
var ConnectionEvent = require('./../../../../src/client/js/event/connection-event');

var BroadcasterService = require('./../../mockups/service/broadcaster-service.mock');
var ConnectionService = require('./../../mockups/service/connection-service.mock');

var LoginView = require('./../../mockups/view/authentication/login-view.mock');
var LogoutView = require('./../../mockups/view/authentication/logout-view.mock');
var RegisterView = require('./../../mockups/view/authentication/register-view.mock');

describe('The AuthenticationController class', function () {
	var AuthenticationController, sandbox, context;
	var email = 'something@somewhere.com';
	var username = 'foo';
	var password = 'bar';
	var character = 'bogus';

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		LoginView.mockStart();
		LogoutView.mockStart();
		RegisterView.mockStart();
		BroadcasterService.mockStart();
		ConnectionService.mockStart();
		AuthenticationController = require('./../../../../src/client/js/controller/authentication-controller');
		context = document.createElement('div');
	});

	afterEach(function() {
		ConnectionService.mockStop();
		BroadcasterService.mockStop();
		RegisterView.mockStop();
		LogoutView.mockStop();
		LoginView.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		AuthenticationController.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, broadcasterService, connectionService;

		beforeEach(function () {
			broadcasterService = new BroadcasterService();
			connectionService = new ConnectionService();
			instance = new AuthenticationController();
		});

		it ('should be an instance of "AuthenticationController"', function () {
			instance.should.be.an.instanceof(AuthenticationController);
		});

		it('should register to the ConnectionEvent.REGISTRATION_ERROR event on the connectionService during setup', function () {
			var spy = sandbox.spy(ConnectionService.prototype, 'on');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(ConnectionEvent.REGISTRATION_ERROR).once;
		});

		it('should register to the ConnectionEvent.CONNECTION_ERROR event on the connectionService during setup', function () {
			var spy = sandbox.spy(ConnectionService.prototype, 'on');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(ConnectionEvent.CONNECTION_ERROR).once;
		});

		it('should register to the ConnectionEvent.AUTHENTICATION_ERROR event on the connectionService during setup', function () {
			var spy = sandbox.spy(ConnectionService.prototype, 'on');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(ConnectionEvent.AUTHENTICATION_ERROR).once;
		});

		it('should register to the ConnectionEvent.OPENED event on the connectionService during setup', function () {
			var spy = sandbox.spy(ConnectionService.prototype, 'on');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(ConnectionEvent.OPENED).once;
		});

		it('should register to the ConnectionEvent.DISCONNECTED event on the connectionService during setup', function () {
			var spy = sandbox.spy(ConnectionService.prototype, 'on');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(ConnectionEvent.DISCONNECTED).once;
		});

		it('should register to the ConnectionEvent.RECONNECTED event on the connectionService during setup', function () {
			var spy = sandbox.spy(ConnectionService.prototype, 'on');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(ConnectionEvent.RECONNECTED).once;
		});

		it('should register to the ConnectionEvent.CLOSED event on the connectionService during setup', function () {
			var spy = sandbox.spy(ConnectionService.prototype, 'on');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(ConnectionEvent.CLOSED).once;
		});

		describe('after the setup', function () {

			beforeEach(function () {
				instance.setup(broadcasterService, connectionService);
			});

			it ('should render the Login view when setting the context', function () {
				var spy = sandbox.spy(LoginView.getInstance(), 'render');

				instance.setContext(context);

				spy.should.have.been.calledWith(context);
			});

			it ('should trigger a NotificationEvent.CONNECTION_FAILED on the broadcastService on a ConnectionEvent.CONNECTION_ERROR', function () {
				var spy = sandbox.spy(broadcasterService, 'emit');

				connectionService.emit(ConnectionEvent.CONNECTION_ERROR);

				spy.should.have.been.calledWith(NotificationEvent.CONNECTION_FAILED);
			});

			it ('should trigger a NotificationEvent.AUTHENTICATION_FAILED on the broadcastService on a ConnectionEvent.AUTHENTICATION_ERROR', function () {
				var spy = sandbox.spy(broadcasterService, 'emit');

				connectionService.emit(ConnectionEvent.AUTHENTICATION_ERROR);

				spy.should.have.been.calledWith(NotificationEvent.AUTHENTICATION_FAILED);
			});

			it ('should trigger a NotificationEvent.REGISTRATION_FAILED on the broadcastService on a ConnectionEvent.REGISTRATION_ERROR', function () {
				var errors = ['email', 'user', 'character'];
				var spy = sandbox.spy(broadcasterService, 'emit');

				connectionService.emit(ConnectionEvent.REGISTRATION_ERROR, errors);

				spy.should.have.been.calledWith(NotificationEvent.REGISTRATION_FAILED, errors);
			});

			it ('should handle a login view AuthenticationEvent.AUTHENTICATE event', function () {
				var spy = sandbox.spy(connectionService, 'open');

				LoginView.getInstance().emit(AuthenticationEvent.AUTHENTICATE, username, password);

				spy.should.have.been.calledWith(username, password);
			});

			it ('should handle a login view AuthenticationEvent.REGISTER event', function () {
				var spy = sandbox.spy(RegisterView.getInstance(), 'render');

				instance.setContext(context);
				LoginView.getInstance().emit(AuthenticationEvent.REGISTER);

				spy.should.have.been.calledWith(context);
			});

			it ('should handle a register view AuthenticationEvent.REGISTER event', function () {
				var spy = sandbox.spy(connectionService, 'register');

				RegisterView.getInstance().emit(AuthenticationEvent.REGISTER, email, username, password, character);

				spy.should.have.been.calledWith(email, username, password, character);
			});

			it ('should handle a register view AuthenticationEvent.AUTHENTICATE event', function () {
				instance.setContext(context);

				var spy = sandbox.spy(LoginView.getInstance(), 'render');
				RegisterView.getInstance().emit(AuthenticationEvent.AUTHENTICATE);

				spy.should.have.been.calledWith(context);
			});

			it ('should render the Logout view after connecting', function () {
				var spy = sandbox.spy(LogoutView.getInstance(), 'render');

				instance.setContext(context);
				connectionService.emit(ConnectionEvent.OPENED);

				spy.should.have.been.calledWith(context);
			});

			it ('should add the disconnected class to the context on connection service disconnected event', function () {
				var spy = sandbox.spy(context.classList, 'add');

				instance.setContext(context);
				connectionService.emit(ConnectionEvent.DISCONNECTED);

				spy.should.have.been.calledWith('disconnected');
			});

			it ('should remove the disconnected class from the context on connection service reconnected event', function () {
				var spy = sandbox.spy(context.classList, 'remove');

				instance.setContext(context);
				connectionService.emit(ConnectionEvent.RECONNECTED);

				spy.should.have.been.calledWith('disconnected');
			});

			it ('should handle a logout view AuthenticationEvent.LOGOUT event', function () {
				var spy = sandbox.spy(connectionService, 'close');

				LogoutView.getInstance().emit(AuthenticationEvent.LOGOUT);

				spy.should.have.been.calledOnce;
			});

			it ('should render the Login view after disconnecting', function () {
				instance.setContext(context);

				var spy = sandbox.spy(LoginView.getInstance(), 'render');

				connectionService.emit(ConnectionEvent.CLOSED);

				spy.should.have.been.calledWith(context);
			});
		});
	});
});
