var sinon  = require('sinon');
var simulant = require('simulant');

var wrongCredentialsTemplate = require('./../../../../../src/client/html/notification/wrong-credentials.html');
var NotifictionEvent = require('./../../../../../src/client/js/event/notification-event');

describe('The Wrong Credentials View class', function () {
	var WrongCredentialsView, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		WrongCredentialsView = require('./../../../../../src/client/js/view/notification/wrong-credentials-view');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		WrongCredentialsView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, context;

		beforeEach(function () {
			context = document.createElement('div');
			context.id = 'NOTIFICATION';
			instance = new WrongCredentialsView();
		});

		it('should be an instance of the WrongCredentialsView class', function () {
			instance.should.be.an.instanceOf(WrongCredentialsView);
		});

		it('should set the context innerHTML to the wrongCredentialsTemplate while rendering', function () {
			context.innerHTML = '<span>Bogus</span>';

			instance.render(context);

			context.innerHTML.should.equal(wrongCredentialsTemplate);
		});

		it('should remove the "hidden" class from the context when rendering', function () {
			context.classList.add('hidden');

			instance.render(context);

			context.classList.contains('hidden').should.be.false;
		});

		describe('after rendering', function () {

			beforeEach(function () {
				instance.render(context);
			});

			it('should fire a NotificationEvent.CLOSE event when the context is clicked', function () {
				var spy = sandbox.spy(instance, 'emit');

				simulant.fire(context.querySelector('.wrong-credentials'), 'click');

				spy.should.have.been.calledWith(NotifictionEvent.CLOSE);
			});
		});
	});
});