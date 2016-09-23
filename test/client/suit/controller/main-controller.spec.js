var sinon = require('sinon');

var MainView = require('./../../mockups/view/main-view.mock');

describe('The MainController class', function () {
	var MainController, sandbox;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		MainView.mockStart();
		MainController = require('./../../../../src/client/js/controller/main-controller');
	});
	afterEach(function() {
		MainView.mockStop();
		sandbox.restore();
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
