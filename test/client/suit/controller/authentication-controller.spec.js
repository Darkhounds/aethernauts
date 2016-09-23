var sinon = require('sinon');

var LoginView = require('./../../mockups/view/login-view.mock');

describe('The AuthenticationController class', function () {
	var AuthenticationController, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		LoginView.mockStart();
		AuthenticationController = require('./../../../../src/client/js/controller/authentication-controller');
		context = document.createElement('div');
	});
	afterEach(function() {
		LoginView.mockStop();
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new AuthenticationController();
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "AuthenticationController"', function () {
			instance.should.be.an.instanceof(AuthenticationController);
		});

		it ('should render the view', function () {
			var spy = sandbox.spy(LoginView.getInstance(), 'render');
			
			instance.setContext(context);

			spy.should.have.been.calledWith(context);
		});
	});
});
