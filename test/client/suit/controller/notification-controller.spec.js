var sinon = require('sinon');

var BroadcasterService  = require('./../../mockups/service/broadcaster-service.mock');
var EmptyView = require('./../../mockups/view/notification/empty-view.mock');
var DisconnectedView = require('./../../mockups/view/notification/disconnected-view.mock');

var NotificationEvent = require('./../../../../src/client/js/event/connection-event');

describe('The Notification Controller class', function () {
	var NotificationController, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		BroadcasterService.mockStart();
		EmptyView.mockStart();
		DisconnectedView.mockStart();
		NotificationController = require('./../../../../src/client/js/controller/notification-controller');
	});

	afterEach(function () {
		DisconnectedView.mockStop();
		EmptyView.mockStop();
		BroadcasterService.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		NotificationController.should.be.a('function');
	});
	
	describe('as an instance', function () {
		var instance, broadcasterService, consoleLog, context;

		beforeEach(function () {
			context = document.createElement('div');
			context.id = 'NOTIFICATION';
			consoleLog = sandbox.stub(console, 'log');
			broadcasterService = new BroadcasterService();
			instance = new NotificationController();
		});

		it('should be an instance of the NotificationController class', function () {
			instance.should.be.an.instanceOf(NotificationController);
		});

		it('should register a NotificationEvent.DISCONNECTED event after the setup', function () {
			var spy = sandbox.spy(broadcasterService, 'on');

			instance.setup(broadcasterService);

			spy.should.have.been.calledWith(NotificationEvent.DISCONNECTED).once;
		});

		it('should register a NotificationEvent.RECONNECTED event after the setup', function () {
			var spy = sandbox.spy(broadcasterService, 'on');

			instance.setup(broadcasterService);

			spy.should.have.been.calledWith(NotificationEvent.RECONNECTED).once;
		});

		describe('after the setup', function () {

			beforeEach(function () {
				instance.setup(broadcasterService);
			});

			it('should render the emptyView when the setContext is called', function () {
				var spy = sandbox.spy(EmptyView.getInstance(), 'render');

				instance.setContext(context);

				spy.should.have.been.calledWith(context);
			});

			it('should render the disconnectedView when the NotificationEvent.DISCONNECTED is fired', function () {
				var spy = sandbox.spy(DisconnectedView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.DISCONNECTED);

				spy.should.have.been.calledWith(context);
			});

			it('should render the emptyView when the NotificationEvent.RECONNECTED is fired', function () {
				var spy = sandbox.spy(EmptyView.getInstance(), 'render');

				instance.setContext(context);
				broadcasterService.emit(NotificationEvent.RECONNECTED);

				spy.should.have.been.calledWith(context);
			});
		});
	});
});
