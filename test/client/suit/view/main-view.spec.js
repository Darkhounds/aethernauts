var sinon = require('sinon');

var ConnectionService = require('./../../mockups/service/connection-service.mock');
var BroadcasterService = require('./../../mockups/service/broadcaster-service.mock');
var AuthenticationController = require('./../../mockups/controller/authentication-controller.mock');
var NotificationController = require('./../../mockups/controller/notification-controller.mock');

describe('The Main View class', function () {
	var MainView, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		ConnectionService.mockStart();
		BroadcasterService.mockStart();
		AuthenticationController.mockStart();
		NotificationController.mockStart();
		MainView = require('./../../../../src/client/js/view/main-view');
		context = document.createElement('div');
		context.innerHTML = '<div id="APP"><div id="AUTHENTICATION"></div></div>';
	});

	afterEach(function() {
		NotificationController.mockStop();
		AuthenticationController.mockStop();
		BroadcasterService.mockStop();
		ConnectionService.mockStop();
		sandbox.restore();
	});

	it ('should be a function', function () {
		MainView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, connectionService, broadcasterService;

		beforeEach(function () {
			connectionService = new ConnectionService();
			broadcasterService = new BroadcasterService();
			instance = new MainView(connectionService);
		});

		it ('should be an instance of "MainView"', function () {
			instance.should.be.an.instanceof(MainView);
		});

		it ('should create a new Authentication Controller with the expected connectionService during setup', function () {
			instance.setup(broadcasterService, connectionService);

			AuthenticationController.should.have.been.called;
		});

		it ('should setup the authenticationController with the expected connectionService during setup', function () {
			var spy = sandbox.spy(AuthenticationController.prototype, 'setup');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(connectionService);
		});

		it ('should create a new Notification Controller with the expected broadcasterService during setup', function () {
			instance.setup(broadcasterService, connectionService);

			NotificationController.should.have.been.called;
		});

		it ('should setup the notificationController with the expected broadcasterService during setup', function () {
			var spy = sandbox.spy(NotificationController.prototype, 'setup');

			instance.setup(broadcasterService, connectionService);

			spy.should.have.been.calledWith(broadcasterService);
		});

		describe('after the setup', function () {
			var authenticationController, notificationController;

			beforeEach(function () {
				instance.setup(broadcasterService, connectionService);
				authenticationController = AuthenticationController.getInstance();
				notificationController = NotificationController.getInstance();
			});

			it ('should render', function () {
				instance.render(context);

				context.querySelector('#APP').classList.contains('app').should.be.true;
			});

			it ('should set the authenticationController context', function () {
				var spy = sandbox.spy(authenticationController, 'setContext');

				instance.render(context);

				spy.should.have.been.calledWith(context.querySelector('#AUTHENTICATION'));
			});
		});
	});
});
