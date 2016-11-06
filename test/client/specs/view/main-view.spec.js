var sinon = require('sinon');

var BroadcasterService = require('./../../mockups/service/broadcaster-service.mock');
var ConnectionService = require('./../../mockups/service/connection-service.mock');

var AuthenticationController = require('./../../mockups/controller/authentication-controller.mock');
var NotificationController = require('./../../mockups/controller/notification-controller.mock');

describe('The Main View class', function () {
	var MainView, sandbox, context, connectionService, broadcasterService;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		broadcasterService = new BroadcasterService();
		connectionService = new ConnectionService();
		context = document.createElement('div');
		context.innerHTML = '<div id="APP"><div id="AUTHENTICATION"></div><div id="NOTIFICATION"></div></div>';

		AuthenticationController.mockStart();
		NotificationController.mockStart();

		MainView = require('./../../../../src/client/js/view/main-view');
	});

	afterEach(function() {
		NotificationController.mockStop();
		AuthenticationController.mockStop();

		BroadcasterService.restore();
		ConnectionService.restore();
		sandbox.restore();
	});

	it ('should be a function', function () {
		MainView.should.be.a('function');
	});

	it ('should create a new authenticationController with the expected broadcasterService and connectionService during creation', function () {
		var instance = new MainView(broadcasterService, connectionService);

		AuthenticationController.should.have.been.calledWith(broadcasterService, connectionService)
			.and.calledWithNew
			.and.calledOnce;
	});

	it ('should create a new notificationController with the expected broadcasterService during creation', function () {
		var instance = new MainView(broadcasterService, connectionService);

		NotificationController.should.have.been.calledWith(BroadcasterService.getInstance())
			.and.calledWithNew
			.and.calledOnce;
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new MainView(connectionService);
		});

		it ('should be an instance of "MainView"', function () {
			instance.should.be.an.instanceof(MainView);
		});

		it ('should render', function () {
			instance.render(context);

			context.querySelector('#APP').classList.contains('app').should.be.true;
		});

		it ('should set the authenticationController context when rendering', function () {
			var spy = sandbox.spy(AuthenticationController.getInstance(), 'setContext');

			instance.render(context);

			spy.should.have.been.calledWith(context.querySelector('#AUTHENTICATION'));
		});

		it ('should set the notificationController context when rendering', function () {
			var spy = sandbox.spy(NotificationController.getInstance(), 'setContext');

			instance.render(context);

			spy.should.have.been.calledWith(context.querySelector('#NOTIFICATION'));
		});
	});
});
