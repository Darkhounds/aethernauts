var sinon  = require('sinon');
var simulant = require('simulant');

var NotificationEvent = require('./../../../../../src/client/js/event/notification-event');

var registrationErrorTemplate = require('./../../../../../src/client/html/notification/registration-error.html');

describe('The Registration Error View class', function () {
	var RegistrationErrorView, sandbox, errors, context;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		errors = ['email', 'username', 'character'];
		context = document.createElement('div');
		context.id = 'NOTIFICATION';

		RegistrationErrorView = require('./../../../../../src/client/js/view/notification/registration-error-view');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		RegistrationErrorView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new RegistrationErrorView();
		});

		it('should be an instance of the RegistrationErrorView class', function () {
			instance.should.be.an.instanceOf(RegistrationErrorView);
		});

		it('should set the context innerHTML to the registrationErrorTemplate while rendering', function () {
			var expectedReasons = '<p>Invalid email</p><p>Invalid username</p><p>Invalid character</p>';
			var expectedHTML = registrationErrorTemplate.replace(/{{REASONS}}/ig, expectedReasons);
			context.innerHTML = '<span>Bogus</span>';

			instance.render(context, errors);

			context.innerHTML.should.equal(expectedHTML);
		});

		it('should remove the "hidden" class from the context when rendering', function () {
			context.classList.add('hidden');

			instance.render(context, errors);

			context.classList.contains('hidden').should.be.false;
		});

		describe('after rendering', function () {

			beforeEach(function () {
				instance.render(context, errors);
			});

			it('should fire a NotificationEvent.CLOSE event when the context is clicked', function () {
				var spy = sandbox.spy(instance, 'emit');

				simulant.fire(context.querySelector('.registration-error'), 'click');

				spy.should.have.been.calledWith(NotificationEvent.CLOSE);
			});
		});
	});
});