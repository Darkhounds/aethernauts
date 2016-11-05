var sinon = require('sinon');

var BroadcasterService  = require('./../../mockups/service/broadcaster-service.mock');
var EmptyView = require('./../../mockups/view/notification/empty-view.mock');
var DisconnectedView = require('./../../mockups/view/notification/disconnected-view.mock');
var WrongCredentialsView = require('./../../mockups/view/notification/wrong-credentials-view.mock');
var ConnectionErrorView = require('./../../mockups/view/notification/connection-error-view.mock');
var RegistrationErrorView = require('./../../mockups/view/notification/registration-error-view.mock');

var NotificationEvent = require('./../../../../src/client/js/event/notification-event');

describe('The Notification Controller class', function () {
	var NotificationController, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		EmptyView.mockStart();
		DisconnectedView.mockStart();
		WrongCredentialsView.mockStart();
		ConnectionErrorView.mockStart();
		RegistrationErrorView.mockStart();
		NotificationController = require('./../../../../src/client/js/controller/notification-controller');
	});

	afterEach(function () {
		RegistrationErrorView.mockStop();
		ConnectionErrorView.mockStop();
		WrongCredentialsView.mockStop();
		DisconnectedView.mockStop();
		EmptyView.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		NotificationController.should.be.a('function');
	});
	
	describe('as an instance', function () {
		var instance, broadcasterService, context;

		beforeEach(function () {
			context = document.createElement('div');
			context.id = 'NOTIFICATION';
			broadcasterService = new BroadcasterService();
			instance = new NotificationController();
		});

		it('should be an instance of the NotificationController class', function () {
			instance.should.be.an.instanceOf(NotificationController);
		});

		it('should register a NotificationEvent.DISCONNECTED event after the setup', function () {
			var spy = sandbox.spy(broadcasterService, 'on');

			instance.setup(broadcasterService);

			spy.should.have.been.calledWith(NotificationEvent.DISCONNECTED);
		});

		it('should register a NotificationEvent.RECONNECTED event after the setup', function () {
			var spy = sandbox.spy(broadcasterService, 'on');

			instance.setup(broadcasterService);

			spy.should.have.been.calledWith(NotificationEvent.RECONNECTED);
		});

		it('should register a NotificationEvent.AUTHENTICATION_FAILED event after the setup', function () {
			var spy = sandbox.spy(broadcasterService, 'on');

			instance.setup(broadcasterService);

			spy.should.have.been.calledWith(NotificationEvent.AUTHENTICATION_FAILED);
		});

		it('should register a NotificationEvent.CONNECTION_FAILED event after the setup', function () {
			var spy = sandbox.spy(broadcasterService, 'on');

			instance.setup(broadcasterService);

			spy.should.have.been.calledWith(NotificationEvent.CONNECTION_FAILED);
		});
		
		it('should register a NotificationEvent.REGISTRATION_FAILED event after the setup', function () {
			var spy = sandbox.spy(broadcasterService, 'on');

			instance.setup(broadcasterService);

			spy.should.have.been.calledWith(NotificationEvent.REGISTRATION_FAILED);
		});

		describe('after the setup', function () {

			beforeEach(function () {
				instance.setup(broadcasterService);
			});

			it('should render the emptyView when the setContext is called', function () {
				var spy = sandbox.spy(EmptyView.getInstance(), 'render');

				instance.setContext(context);

				spy.should.have.been.calledWith(context);
			});

			it('should render the disconnectedView when the NotificationEvent.DISCONNECTED is fired', function () {
				var spy = sandbox.spy(DisconnectedView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.DISCONNECTED);

				spy.should.have.been.calledWith(context);
			});

			it('should fail silently when the NotificationEvent.DISCONNECTED is fired more then once', function () {
				var spy = sandbox.spy(DisconnectedView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.DISCONNECTED);
				broadcasterService.emit(NotificationEvent.DISCONNECTED);

				spy.should.have.been.calledWith(context);
			});

			it('should render the emptyView when the NotificationEvent.RECONNECTED is fired', function () {
				var spy = sandbox.spy(EmptyView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.DISCONNECTED);
				broadcasterService.emit(NotificationEvent.RECONNECTED);

				spy.should.have.been.calledWith(context);
			});

			it('should fail silently when the NotificationEvent.RECONNECTED is fired more then once', function () {
				var spy = sandbox.spy(EmptyView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.DISCONNECTED);
				broadcasterService.emit(NotificationEvent.RECONNECTED);
				broadcasterService.emit(NotificationEvent.RECONNECTED);

				spy.should.have.been.calledWith(context);
			});

			it('should render the wrongCredentialsView when the NotificationEvent.AUTHENTICATION_FAILED is fired', function () {
				var spy = sandbox.spy(WrongCredentialsView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.AUTHENTICATION_FAILED);

				spy.should.have.been.calledWith(context);
			});

			it('should fail silently when the NotificationEvent.AUTHENTICATION_FAILED is fired more then once', function () {
				var spy = sandbox.spy(WrongCredentialsView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.AUTHENTICATION_FAILED);
				broadcasterService.emit(NotificationEvent.AUTHENTICATION_FAILED);

				spy.should.have.been.calledWith(context);
			});

			it('should render the emptyView when the wrongCredentialsView fires a NotificationEvent.CLOSE event', function () {
				instance.setContext(context);

				var spy = sandbox.spy(EmptyView.getInstance(), 'render');
				broadcasterService.emit(NotificationEvent.AUTHENTICATION_FAILED);
				WrongCredentialsView.getInstance().emit(NotificationEvent.CLOSE);

				spy.should.have.been.calledWith(context);
			});

			it('should fail silently when the wrongCredentialsView fires a NotificationEvent.CLOSE is fired more then once', function () {
				instance.setContext(context);

				var spy = sandbox.spy(EmptyView.getInstance(), 'render');
				broadcasterService.emit(NotificationEvent.AUTHENTICATION_FAILED);
				WrongCredentialsView.getInstance().emit(NotificationEvent.CLOSE);
				WrongCredentialsView.getInstance().emit(NotificationEvent.CLOSE);

				spy.should.have.been.calledWith(context);
			});

			it('should render the connectionErrorView when the NotificationEvent.CONNECTION_FAILED is fired', function () {
				var spy = sandbox.spy(ConnectionErrorView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.CONNECTION_FAILED);

				spy.should.have.been.calledWith(context);
			});

			it('should fail silently when the NotificationEvent.CONNECTION_FAILED is fired more then once', function () {
				var spy = sandbox.spy(ConnectionErrorView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.CONNECTION_FAILED);
				broadcasterService.emit(NotificationEvent.CONNECTION_FAILED);

				spy.should.have.been.calledWith(context);
			});

			it('should render the emptyView when the connectionErrorView fires a NotificationEvent.CLOSE event', function () {
				instance.setContext(context);

				var spy = sandbox.spy(EmptyView.getInstance(), 'render');
				broadcasterService.emit(NotificationEvent.CONNECTION_FAILED);
				ConnectionErrorView.getInstance().emit(NotificationEvent.CLOSE);

				spy.should.have.been.calledWith(context);
			});

			it('should fail silently when the connectionErrorView fires a NotificationEvent.CLOSE is fired more then once', function () {
				instance.setContext(context);

				var spy = sandbox.spy(EmptyView.getInstance(), 'render');
				broadcasterService.emit(NotificationEvent.CONNECTION_FAILED);
				ConnectionErrorView.getInstance().emit(NotificationEvent.CLOSE);
				ConnectionErrorView.getInstance().emit(NotificationEvent.CLOSE);

				spy.should.have.been.calledWith(context);
			});

			it('should render the registrationErrorView when the NotificationEvent.REGISTRATION_FAILED is fired', function () {
				var errors = ['email', 'user', 'character'];
				var spy = sandbox.spy(RegistrationErrorView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.REGISTRATION_FAILED, errors);

				spy.should.have.been.calledWith(context, errors);
			});

			it('should fail silently when the NotificationEvent.REGISTRATION_FAILED is fired more then once', function () {
				var spy = sandbox.spy(RegistrationErrorView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.REGISTRATION_FAILED);
				broadcasterService.emit(NotificationEvent.REGISTRATION_FAILED);

				spy.should.have.been.calledWith(context);
			});

			it('should render the emptyView when the registrationErrorView fires a NotificationEvent.CLOSE event', function () {
				instance.setContext(context);

				var spy = sandbox.spy(EmptyView.getInstance(), 'render');
				broadcasterService.emit(NotificationEvent.REGISTRATION_FAILED);
				RegistrationErrorView.getInstance().emit(NotificationEvent.CLOSE);

				spy.should.have.been.calledWith(context);
			});

			it('should fail silently when the registrationErrorView fires a NotificationEvent.CLOSE is fired more then once', function () {
				instance.setContext(context);

				var spy = sandbox.spy(EmptyView.getInstance(), 'render');
				broadcasterService.emit(NotificationEvent.REGISTRATION_FAILED);
				RegistrationErrorView.getInstance().emit(NotificationEvent.CLOSE);
				RegistrationErrorView.getInstance().emit(NotificationEvent.CLOSE);

				spy.should.have.been.calledWith(context);
			});
		});
	});
});
