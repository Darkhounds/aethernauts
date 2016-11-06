var sinon = require('sinon');
var simulant = require('simulant');

var EventEmitter = require('events').EventEmitter;

var AuthenticationEvent = require('./../../../../../src/client/js/event/authentication-event');

describe('The Register View class', function () {
	var RegisterView, sandbox, email, username, password, character, context;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		email = 'email@domain.ext';
		username = 'foo';
		password = 'bar';
		character = 'bogus';
		context = document.createElement('div');
		context.id = 'REGISTRATION';

		RegisterView = require('./../../../../../src/client/js/view/authentication/register-view');
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should be a function', function () {
		RegisterView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new RegisterView();
		});

		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "RegisterView"', function () {
			instance.should.be.an.instanceof(RegisterView);
		});

		it ('should be an instance of "EventEmitter"', function () {
			instance.should.be.an.instanceof(EventEmitter);
		});

		it ('should render', function () {
			instance.render(context);

			context.classList.contains('register').should.be.true;
		});

		it ('should render with an registration form element', function () {
			instance.render(context);

			context.querySelector('form#REGISTRATION').should.exist;
		});

		it ('should render with a email input element with the default value', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#EMAIL input').value.should.equal('');
		});

		it ('should render with a email confirmation input element with the default value', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#CONFIRM-EMAIL input').value.should.equal('');
		});

		it ('should render with a username input element with the default value', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#USERNAME input').value.should.equal('');
		});

		it ('should render with a password input element with the default value', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#PASSWORD input[type="password"]').value.should.equal('');
		});

		it ('should render with a password confirmation input element with the default value', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#CONFIRM-PASSWORD input[type="password"]').value.should.equal('');
		});

		it ('should render with a register submit element with the default value', function () {
			instance.setData();
			instance.render(context);

			context.querySelector('#REGISTER[type="submit"]').value.should.equal('');
		});

		it ('should set the email field to the email passed on setData after rendering', function () {
			instance.setData({email: email});
			instance.render(context);

			context.querySelector('#EMAIL input').value.should.equal(email);
		});

		it ('should set the confirm email field to the email passed on setData after rendering', function () {
			instance.setData({email: email});
			instance.render(context);

			context.querySelector('#CONFIRM-EMAIL input').value.should.equal(email);
		});

		it ('should set the password field to the password passed on setData after rendering', function () {
			instance.setData({password: password});
			instance.render(context);

			context.querySelector('#PASSWORD input').value.should.equal(password);
		});

		it ('should set the confirm password field to the password passed on setData after rendering', function () {
			instance.setData({password: password});
			instance.render(context);

			context.querySelector('#CONFIRM-PASSWORD input').value.should.equal(password);
		});

		it ('should set the username field to the username passed on setData after rendering', function () {
			instance.setData({username: username});
			instance.render(context);

			context.querySelector('#USERNAME input').value.should.equal(username);
		});

		it ('should set the character field to the character name passed on setData after rendering', function () {
			instance.setData({character: character});
			instance.render(context);

			context.querySelector('#CHARACTER input').value.should.equal(character);
		});

		it ('should trigger show the email confirmation error clicking the register submit element with an invalid email confirmation', function () {
			instance.render(context);
			context.querySelector('#EMAIL input').value = email;
			context.querySelector('#CONFIRM-EMAIL input').value = 'not' + email;

			simulant.fire(context.querySelector('#REGISTER[type="submit"]'), 'click');

			context.querySelector('#CONFIRM-EMAIL .error').classList.contains('hidden').should.be.false;
		});

		it ('should trigger show the password confirmation error clicking the register submit element with an invalid email confirmation', function () {
			instance.render(context);
			context.querySelector('#EMAIL input').value = email;
			context.querySelector('#CONFIRM-EMAIL input').value = email;
			context.querySelector('#PASSWORD input').value = password;
			context.querySelector('#CONFIRM-PASSWORD input').value = 'not' + password ;

			simulant.fire(context.querySelector('#REGISTER[type="submit"]'), 'click');

			context.querySelector('#CONFIRM-PASSWORD .error').classList.contains('hidden').should.be.false;
		});

		it ('should trigger an AuthenticationEvent.REGISTER event when clicking the register submit element with a valid form', function () {
			var spy = sandbox.spy();
			instance.on(AuthenticationEvent.REGISTER, spy);

			instance.render(context);
			context.querySelector('#EMAIL input').value = email;
			context.querySelector('#CONFIRM-EMAIL input').value = email;
			context.querySelector('#USERNAME input').value = username;
			context.querySelector('#PASSWORD input[type="password"]').value = password;
			context.querySelector('#CONFIRM-PASSWORD input[type="password"]').value = password;
			context.querySelector('#CHARACTER input').value = character;

			simulant.fire(context.querySelector('#REGISTER[type="submit"]'), 'click');

			spy.should.have.been.calledWith(email, username, password, character);
		});

		it ('should trigger a "submit" event when registering', function () {
			var spy = sandbox.spy();

			instance.render(context);
			context.querySelector('#REGISTRATION').addEventListener('submit', spy);
			simulant.fire(context.querySelector('#REGISTER[type="submit"]'), 'click');

			spy.should.have.been.calledOnce;
		});

		it ('should change the registration form element action property to "save-form-history?[CURRENT DATE]" ', function () {
			var spy = sandbox.spy();

			sandbox.useFakeTimers(Date.now());
			instance.render(context);
			context.addEventListener('submit', spy);
			simulant.fire(context.querySelector('#REGISTER[type="submit"]'), 'click');

			context.querySelector('form#REGISTRATION').action.should.equal('http://localhost/save-form-history?' + Date.now());
		});

		it ('should trigger prevent the "submit" event from bubbling when authenticating', function () {
			var spy = sandbox.spy();

			instance.render(context);
			context.addEventListener('submit', spy);
			simulant.fire(context.querySelector('#REGISTER[type="submit"]'), 'click');

			spy.should.have.not.been.called;
		});

		it ('should trigger an AuthenticationEvent.AUTHENTICATE event when clicking the login submit element', function () {
			var spy = sandbox.spy();

			instance.on(AuthenticationEvent.AUTHENTICATE, spy);
			instance.render(context);
			simulant.fire(context.querySelector('#LOGIN'), 'click');

			spy.should.have.been.calledOnce;
		});
	});
});
