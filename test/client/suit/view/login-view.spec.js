var sinon = require('sinon');

describe('The LoginView class', function () {
	var LoginView, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		LoginView = require('./../../../../src/client/js/view/login-view');
		context = document.createElement('div');
		context.id = 'AUTHENTICATION';
	});
	afterEach(function() {
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new LoginView();
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "LoginView"', function () {
			instance.should.be.an.instanceof(LoginView);
		});

		it ('should render', function () {
			instance.render(context);

			context.classList.contains('authentication').should.be.true;
		});

		it ('should render with the specified data', function () {
			instance.setData({});
			instance.render(context);

			context.querySelector('.login').should.exist;
		});
	});
});
