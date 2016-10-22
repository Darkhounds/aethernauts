var sinon = require('sinon');

var ConnectionService = require('./../../mockups/service/connection-service.mock');
var BroadcasterService = require('./../../mockups/service/broadcaster-service.mock');
var AuthenticationController = require('./../../mockups/controller/authentication-controller.mock');

describe('The MainView class', function () {
	var MainView, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		ConnectionService.mockStart();
		BroadcasterService.mockStart();
		AuthenticationController.mockStart();
		MainView = require('./../../../../src/client/js/view/main-view');
		context = document.createElement('div');
		context.innerHTML = '<div id="APP"><div id="AUTHENTICATION"></div></div>';
	});

	afterEach(function() {
		AuthenticationController.mockStop();
		BroadcasterService.mockStop();
		ConnectionService.mockStop();
		sandbox.restore();
	});

	it ('should be a function', function () {
		MainView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, connectionService, broadcasterService, authenticationController;

		beforeEach(function () {
			connectionService = new ConnectionService();
			broadcasterService = new BroadcasterService();
			instance = new MainView(connectionService);
			instance.setup(broadcasterService, connectionService);
			authenticationController = AuthenticationController.getInstance();
		});

		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "MainView"', function () {
			instance.should.be.an.instanceof(MainView);
		});

		it ('should create a new Authentication Controller with the expected connectionService when setup', function () {
			AuthenticationController.should.have.been.called;
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
