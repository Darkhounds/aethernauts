var sinon = require('sinon');
var simulant = require('simulant');
var EventEmitter = require('events').EventEmitter;

var AuthenticationEvent = require('./../../../../../src/client/js/event/authentication-event');

describe('The LogoutView class', function () {
	var LogoutView, sandbox, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		LogoutView = require('./../../../../../src/client/js/view/authentication/logout-view');
		context = document.createElement('div');
		context.id = 'AUTHENTICATION';
	});
	
	afterEach(function() {
		sandbox.restore();
	});

	it('should be a function', function () {
		LogoutView.should.be.a('function');
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

		it ('should trigger a AuthenticationEvent.LOGOUT event when clicking the logout button', function () {
			var spy = sandbox.spy();

			instance.on(AuthenticationEvent.LOGOUT, spy);
			instance.render(context);
			simulant.fire(context.querySelector('#LOGOUT[type="button"]'), 'click');

			spy.should.have.been.calledOnce;
		});
	});
});
