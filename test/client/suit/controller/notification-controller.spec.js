var sinon = require('sinon');

var BroadcasterService  = require('./../../mockups/service/broadcaster-service.mock');

var NotificationEvent = require('./../../../../src/client/js/event/connection-event');

describe('The Notification Controller class', function () {
	var NotificationController, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		BroadcasterService.mockStart();
		NotificationController = require('./../../../../src/client/js/controller/notification-controller');
	});

	afterEach(function () {
		BroadcasterService.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		NotificationController.should.be.a('function');
	});
	
	describe('as an instance', function () {
		var instance, broadcasterService, consoleLog, context;

		beforeEach(function () {
			context = {};
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

		it('should output a log when the setContext is called', function () {
			instance.setContext(context);

			consoleLog.should.have.been.calledWith(context);
		});

		describe('after the setup', function () {

			beforeEach(function () {
				instance.setup(broadcasterService);
			});

			it('should output a log when the NotificationEvent.DISCONNECTED is fired', function () {
				broadcasterService.emit(NotificationEvent.DISCONNECTED);
				consoleLog.should.have.been.calledWith('disconnected');
			});

			it('should output a log when the NotificationEvent.RECONNECTED is fired', function () {
				broadcasterService.emit(NotificationEvent.RECONNECTED);
				consoleLog.should.have.been.calledWith('reconnected');
			});
		});
	});
});
