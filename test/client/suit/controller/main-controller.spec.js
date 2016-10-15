var sinon = require('sinon');
var jsdom = require('jsdom');

var MainView = require('./../../mockups/view/main-view.mock');
var connectionService = require('./../../mockups/service/connection-service.mock');

describe('The MainController class', function () {
	var MainController, sandbox;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		MainView.mockStart();
		connectionService.mockStart();
		MainController = require('./../../../../src/client/js/controller/main-controller');
	});
	afterEach(function() {
		connectionService.mockStop();
		MainView.mockStop();
		sandbox.restore();
	});

	it ('should setup the connection service when created with the default url', function () {
		var address = 'localhost';
		var port = '3002';
		var spy = sandbox.spy(connectionService.getInstance(), 'setup');

		new MainController();

		spy.should.have.been.calledWith('ws://' + address + ':' + port);
	});

	it ('should define a new connection service with the expected url', function () {
		var address = 'bogus';
		var port = '666';
		var spy = sandbox.spy(connectionService.getInstance(), 'setup');

		setWindowAddress('http://localhost?serverAddress=' + address + '&serverPort=' + port);

		new MainController();

		spy.should.have.been.called

		resetWindowAddress();
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new MainController();
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "MainController"', function () {
			instance.should.be.an.instanceof(MainController);
		});

		it ('should render the view after the dom is loaded with the document as argument', function () {
			var spy = sandbox.spy(MainView.getInstance(), 'render');

			document.readyState = 'complete';

			spy.should.have.been.calledWith(document);
		});
	});
});
