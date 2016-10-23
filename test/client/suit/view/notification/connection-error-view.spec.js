var sinon  = require('sinon');
var simulant = require('simulant');

var connectionErrorTemplate = require('./../../../../../src/client/html/notification/connection-error.html');
var NotificationEvent = require('./../../../../../src/client/js/event/notification-event');

describe('The Connection Error View class', function () {
	var ConnectionErrorView, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		ConnectionErrorView = require('./../../../../../src/client/js/view/notification/connection-error-view');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		ConnectionErrorView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, context;

		beforeEach(function () {
			context = document.createElement('div');
			context.id = 'NOTIFICATION';
			instance = new ConnectionErrorView();
		});

		it('should be an instance of the ConnectionErrorView class', function () {
			instance.should.be.an.instanceOf(ConnectionErrorView);
		});

		it('should set the context innerHTML to the connectionErrorTemplate while rendering', function () {
			context.innerHTML = '<span>Bogus</span>';

			instance.render(context);

			context.innerHTML.should.equal(connectionErrorTemplate);
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

				simulant.fire(context.querySelector('.connection-error'), 'click');

				spy.should.have.been.calledWith(NotificationEvent.CLOSE);
			});
		});
	});
});