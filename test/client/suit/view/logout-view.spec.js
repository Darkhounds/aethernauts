var sinon = require('sinon');
var simulant = require('simulant');
var EventEmitter = require('events').EventEmitter;

describe('The LogoutView class', function () {
	var LogoutView, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		LogoutView = require('./../../../../src/client/js/view/logout-view');
		context = document.createElement('div');
		context.id = 'AUTHENTICATION';
	});
	afterEach(function() {
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new LogoutView();
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "LogoutView"', function () {
			instance.should.be.an.instanceof(LogoutView);
		});

		it ('should be an instance of "EventEmitter"', function () {
			instance.should.be.an.instanceof(EventEmitter);
		});

		it ('should render', function () {
			instance.render(context);

			context.classList.contains('logout').should.be.true;
		});

		it ('should render with default data', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#LOGOUT[type="button"]').should.exist;
		});

		it ('should render with a logout submit button', function () {
			instance.render(context);

			context.querySelector('#LOGOUT[type="button"]').should.exist;
		});

		it ('should trigger a "disconnect" event when clicking the logout button', function () {
			var spy = sandbox.spy();

			instance.on('disconnect', spy);
			instance.render(context);
			simulant.fire(context.querySelector('#LOGOUT[type="button"]'), 'click');

			spy.should.have.been.calledOnce;
		});
	});
});
