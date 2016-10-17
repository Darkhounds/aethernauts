var sinon = require('sinon');
var simulant = require('simulant');

var MainView = require('./../../mockups/view/main-view.mock');
var ConnectionService = require('./../../mockups/service/connection-service.mock');

describe('The Main Controller class', function () {
	var MainController, sandbox;
	var address = '127.0.0.1';
	var port = '999';
	var path = '/bogus';

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		MainView.mockStart();
		ConnectionService.mockStart();
		MainController = require('./../../../../src/client/js/controller/main-controller');
	});

	afterEach(function() {
		ConnectionService.mockStop();
		MainView.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		MainController.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, connectionService, mainView;

		beforeEach(function () {
			instance = new MainController();
			connectionService = ConnectionService.getInstance();
			mainView = MainView.getInstance();
		});

		afterEach(function () {
			instance = null;
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

			it ('should render the view after the dom is loaded with the document as argument', function () {
				var spy = sandbox.spy(mainView, 'render');

				mockReadystatechangeListener();

				spy.should.have.been.calledWith(document);
			});

			it ('should not render the view if the readyStateChange is not to "complete" state', function () {
				var spy = sandbox.spy(mainView, 'render');

				document.readyState = 'bogus';
				mockReadystatechangeListener();

				spy.should.not.have.been.calledWith(document);
			});
		});
	});
});
