var sinon = require('sinon');

var AuthenticationController = require('./../../mockups/controller/authentication-controller.mock');

describe('The MainView class', function () {
	var MainView, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		AuthenticationController.mockStart();
		MainView = require('./../../../../src/client/js/view/main-view');
		context = document.createElement('div');
		context.innerHTML = '<div id="APP"><div id="AUTHENTICATION"></div></div>';
	});
	afterEach(function() {
		AuthenticationController.mockStop();
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new MainView();
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "MainView"', function () {
			instance.should.be.an.instanceof(MainView);
		});

		it ('should render', function () {
			instance.render(context);
			
			context.querySelector('#APP').classList.contains('app').should.be.true;
		});

		it ('should set the authenticationController context', function () {
			var spy = sandbox.spy(AuthenticationController.getInstance(), 'setContext');

			instance.render(context);

			spy.should.have.been.calledWith(context.querySelector('#AUTHENTICATION'));
		});
	});
});
