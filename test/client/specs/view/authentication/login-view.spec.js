var sinon = require('sinon');
var simulant = require('simulant');

var EventEmitter = require('events').EventEmitter;

var AuthenticationEvent = require('./../../../../../src/client/js/event/authentication-event');

describe('The Login View class', function () {
	var LoginView, sandbox, username, password, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		username = 'foo';
		password = 'bar';
		context = document.createElement('div');
		context.id = 'AUTHENTICATION';

		LoginView = require('./../../../../../src/client/js/view/authentication/login-view');
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should be a function', function () {
		LoginView.should.be.a('function');
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

		it ('should be an instance of "EventEmitter"', function () {
			instance.should.be.an.instanceof(EventEmitter);
		});

		it ('should render', function () {
			instance.render(context);

			context.classList.contains('login').should.be.true;
		});

		it ('should render with an authentication form element', function () {
			instance.render(context);

			context.querySelector('form#AUTHENTICATION').should.exist;
		});

		it ('should render with a username input element', function () {
			instance.render(context);

			context.querySelector('#USERNAME input').should.exist;
		});

		it ('should render with a password input element', function () {
			instance.render(context);

			context.querySelector('#PASSWORD input[type="password"]').should.exist;
		});

		it ('should render with a login submit element', function () {
			instance.render(context);

			context.querySelector('#LOGIN[type="submit"]').should.exist;
		});

		it ('should render with default data', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#USERNAME input').value.should.equal('');
		});

		it ('should render with the specified username', function () {
			instance.setData({username: username});
			instance.render(context);

			context.querySelector('#USERNAME input').value.should.equal(username);
		});

		it ('should render with the specified password', function () {
			var password = 'bar';
			instance.setData({password: password});
			instance.render(context);

			context.querySelector('#PASSWORD input').value.should.equal(password);
		});

		it ('should trigger an AuthenticationEvent.AUTHENTICATE event when clicking the login submit element', function () {
			var spy = sandbox.spy();

			instance.on(AuthenticationEvent.AUTHENTICATE, spy);
			instance.setData({username: username, password: password});
			instance.render(context);
			simulant.fire(context.querySelector('#LOGIN[type="submit"]'), 'click');

			spy.should.have.been.calledWith(username, password);
		});

		it ('should trigger a "submit" event when authenticating', function () {
			var spy = sandbox.spy();

			instance.render(context);
			context.querySelector('#AUTHENTICATION').addEventListener('submit', spy);
			simulant.fire(context.querySelector('#LOGIN[type="submit"]'), 'click');

			spy.should.have.been.calledOnce;
		});

		it ('should change the authentication form element action property to "save-form-history?[CURRENT DATE]" ', function () {
			var spy = sandbox.spy();

			sandbox.useFakeTimers(Date.now());
			instance.render(context);
			context.addEventListener('submit', spy);
			simulant.fire(context.querySelector('#LOGIN[type="submit"]'), 'click');

			context.querySelector('form#AUTHENTICATION').action.should.equal('http://localhost/save-form-history?' + Date.now());
		});

		it ('should trigger prevent the "submit" event from bubbling when authenticating', function () {
			var spy = sandbox.spy();

			instance.render(context);
			context.addEventListener('submit', spy);
			simulant.fire(context.querySelector('#LOGIN[type="submit"]'), 'click');

			spy.should.have.not.been.called;
		});

		it ('should trigger an AuthenticationEvent.REGISTER event when clicking the login submit element', function () {
			var spy = sandbox.spy();

			instance.on(AuthenticationEvent.REGISTER, spy);
			instance.render(context);
			simulant.fire(context.querySelector('#REGISTER'), 'click');

			spy.should.have.been.calledOnce;
		});
	});
});
