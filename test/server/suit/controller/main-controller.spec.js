var sinon = require('sinon');

var EventManager = require('./../../mockups/component/event-manager.mock');

var DataStorage = require('./../../mockups/component/data-storage.mock');
var UsersModel = require('./../../mockups/model/users-model.mock');

var HTTPRequestRouter = require('./../../mockups/route/http-request-router.mock');
var DataRouter = require('./../../mockups/route/data-router.mock');

describe('The Main Controller class', function () {
	var MainController, sandbox, consoleLog;
	var port = 999;
	var root = 'bogus';

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		consoleLog = sandbox.stub(console, 'log');
		EventManager.mockStart();
		DataStorage.mockStart();
		UsersModel.mockStart();
		HTTPRequestRouter.mockStart();
		DataRouter.mockStart();
		MainController = require('./../../../../src/server/controller/main-controller');
	});
	afterEach(function () {
		EventManager.mockStop();
		DataStorage.mockStop();
		UsersModel.mockStop();
		HTTPRequestRouter.mockStop();
		DataRouter.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		MainController.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new MainController(port, root);
		});

		it('should be an instance of', function () {
			instance.should.be.an.instanceOf(MainController);
		});

		it('should connect', function (done) {
			DataStorage.addResponse(null, {});
			HTTPRequestRouter.addResponse(null, {});

			instance.connect().then(function () {
				done();
			});
		});

		it('should output DataStorage errors thrown when connecting', function (done) {
			var expectedError = new Error('BogusError')

			DataStorage.addResponse(expectedError);

			instance.connect().catch(function (error) {
				expectedError.should.equal(error);
				done();
			});
		});

		it('should output HTTPRequestRouter errors thrown when connecting', function (done) {
			var expectedError = new Error('BogusError');

			DataStorage.addResponse(null, {});
			HTTPRequestRouter.addResponse(expectedError);

			instance.connect().catch(function (error) {
				expectedError.should.equal(error);
				done();
			});
		});
	});
});
