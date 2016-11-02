var sinon = require('sinon');

var EventManager = require('./../../mockups/component/event-manager.mock');

var WaterlineConfig = require('./../../mockups/object/waterline-config.mock');
var ServerConfig = require('./../../mockups/object/server-config.mock');
var DataStorage = require('./../../mockups/component/data-storage.mock');
var UsersModel = require('./../../mockups/model/users-model.mock');

var HTTPRequestRouter = require('./../../mockups/route/http-request-router.mock');
var DataRouter = require('./../../mockups/route/data-router.mock');

describe('The Main Controller class', function () {
	var MainController, sandbox, consoleLog, port, root;

	beforeEach(function () {
		port = 999;
		root = 'bogus/';
		sandbox = sinon.sandbox.create();
		consoleLog = sandbox.stub(console, 'log');
		EventManager.mockStart();
		WaterlineConfig.mockStart();
		ServerConfig.mockStart();
		DataStorage.mockStart();
		UsersModel.mockStart();
		HTTPRequestRouter.mockStart();
		DataRouter.mockStart();
		MainController = require('./../../../../src/server/controller/main-controller');
	});

	afterEach(function () {
		UsersModel.mockStop();
		DataStorage.mockStop();
		ServerConfig.mockStop();
		WaterlineConfig.mockStop();
		EventManager.mockStop();
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
			instance = new MainController();
		});

		it('should be an instance of', function () {
			instance.should.be.an.instanceOf(MainController);
		});

		it('should create a new WaterlineConfig when setting up', function () {
			instance.setup(port, root);

			WaterlineConfig.should.have.been.calledWith(root + 'data/').once;
		});

		it('should create a new DataStorage when setting up', function () {
			instance.setup(port, root);

			DataStorage.should.have.been.calledOnce;
		});

		it('should setup the new DataStorage with the WaterlineConfig instance when setting up', function () {
			var spy = sandbox.spy(DataStorage.prototype, 'setup');

			instance.setup(port, root);

			spy.should.have.been.calledWith(WaterlineConfig.getInstance()).once;
		});

		it('should create a new UserModel when setting up', function () {
			instance.setup(port, root);

			UsersModel.should.have.been.calledWithNew.once;
		});

		it('should create the UserModel with the expected data', function () {
			instance.setup(port, root);

			UsersModel.should.have.been.calledWith([{ type: 'god', username: 'username', password: 'password' }]).once;
		});

		it('should register a new UserModel under "users" name with the DataStorage when setting up', function () {
			var spy = sandbox.spy(DataStorage.prototype, 'addModel');

			instance.setup(port, root);

			spy.should.have.been.calledWith('users', UsersModel.getInstance());
		});

		it('should create a new ServerConfig when setting up', function () {
			instance.setup(port, root);

			ServerConfig.should.have.been.calledWith(root, port).once;
		});

		it('should create a new HTTPRequestRouter when setting up', function () {
			instance.setup(port, root);

			HTTPRequestRouter.should.have.been.calledWithNew.once
		});

		it('should inject the EventManager and DataStorage into the new HTTPRequestRouter when setting up', function () {
			instance.setup(port, root);

			HTTPRequestRouter.should.have.been.calledWith(EventManager.getInstance(), DataStorage.getInstance()).once;
		});

		it('should setup the new HTTPRequestRouter with the ServerConfig when setting up', function () {
			var spy = sandbox.spy(HTTPRequestRouter.prototype, 'setup');

			instance.setup(port, root);

			spy.should.have.been.calledWith(ServerConfig.getInstance()).once;
		});

		it('should create a new DataRouter when setting up', function () {
			instance.setup(port, root);

			DataRouter.should.have.been.calledWithNew.once;
		});

		it('should setup the new DataRouter with the ServerConfig when setting up', function () {
			var spy = sandbox.spy(DataRouter.prototype, 'setup');

			instance.setup(port, root);

			spy.should.have.been.calledWith(ServerConfig.getInstance());
		});

		describe('after the setup', function () {

			beforeEach(function () {
				instance.setup(port, root);
			});

			it('should connect', function (done) {
				DataStorage.addResponse(null, {});
				HTTPRequestRouter.addResponse(null, {});

				instance.connect().then(function () {
					done();
				});
			});

			it('should output DataStorage errors thrown when connecting', function (done) {
				var expectedError = new Error('BogusError');

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
});
