var sinon = require('sinon');
var simulant = require('simulant');

var ConnectionEvent = require('./../../../../src/client/js/event/connection-event');
var NotificationEvent = require('./../../../../src/client/js/event/notification-event');

var BroadcasterService = require('./../../mockups/service/broadcaster-service.mock');
var ConnectionService = require('./../../mockups/service/connection-service.mock');
var MainView = require('./../../mockups/view/main-view.mock');

describe('The Main Controller class', function () {
	var MainController, address, port, path, sandbox, connectionService, broadcasterService, mainView;


	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		address = '127.0.0.1';
		port = '999';
		path = '/bogus';

		ConnectionService.mockStart();
		BroadcasterService.mockStart();
		MainView.mockStart();

		MainController = require('./../../../../src/client/js/controller/main-controller');
	});

	afterEach(function() {
		MainView.mockStop();
		BroadcasterService.mockStop();
		ConnectionService.mockStop();

		sandbox.restore();
	});

	it('should be a function', function () {
		MainController.should.be.a('function');
	});

	it('should create a mainView with the connectionService and broadcasterService during creation', function () {
		var instance = new MainController();

		MainView.should.have.been.calledWith(BroadcasterService.getInstance(), ConnectionService.getInstance());
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new MainController();
			connectionService = ConnectionService.getInstance();
			broadcasterService = BroadcasterService.getInstance();
			mainView = MainView.getInstance();
		});

		it ('should be an instance of "MainController"', function () {
			instance.should.be.an.instanceof(MainController);
		});

		it('should setup the connectionService with the default url after the setup', function() {
			var spy = sandbox.spy(connectionService, 'setup');
			var expectedURL = 'ws://' + MainController.DEFAULT_ADDRESS + ':' + MainController.DEFAULT_PORT + MainController.DEFAULT_PATH;

			instance.setup();

			spy.should.have.been.calledWith(expectedURL);
		});

		it('should setup the connectionService with the expected url after the setup', function() {
			var spy = sandbox.spy(connectionService, 'setup');
			var expectedURL = 'ws://' + address + ':' + port + path;

			instance.setup(address, port, path);

			spy.should.have.been.calledWith(expectedURL);
		});

		describe('after setup', function () {
			var mockReadystatechangeListener;

			beforeEach(function () {
				sandbox.stub(document, 'addEventListener', function (type, cb) {
					switch (type) {
						case 'readystatechange': mockReadystatechangeListener = cb; break;
						default: break;
					}
				});
				instance.setup(address, port, path);
			});

			it('should render the view after the dom is loaded with the document as argument', function () {
				var spy = sandbox.spy(mainView, 'render');

				document.readyState = 'complete';
				mockReadystatechangeListener();

				spy.should.have.been.calledWith(document);
			});

			it('should not render the view if the readyStateChange is not to "complete" state', function () {
				var spy = sandbox.spy(mainView, 'render');

				document.readyState = 'bogus';
				mockReadystatechangeListener();

				spy.should.not.have.been.calledWith(document);
			});


			describe('and after the dom has loaded', function () {

				beforeEach(function () {
					document.readyState = 'complete';
					mockReadystatechangeListener();
				});

				it('should trigger a NotificationEvent.DISCONNECTED on the broadcasterService when the connectionService fires a ConnectionEvent.DISCONNECTED', function () {
					var spy = sandbox.spy(broadcasterService, 'emit');

					connectionService.emit(ConnectionEvent.DISCONNECTED);

					spy.should.have.been.calledWith(NotificationEvent.DISCONNECTED);
				});

				it('should trigger a NotificationEvent.RECONNECTED on the broadcasterService when the connectionService fires a ConnectionEvent.RECONNECTED', function () {
					var spy = sandbox.spy(broadcasterService, 'emit');

					connectionService.emit(ConnectionEvent.RECONNECTED);

					spy.should.have.been.calledWith(NotificationEvent.RECONNECTED);
				});
			});
		});
	});
});
