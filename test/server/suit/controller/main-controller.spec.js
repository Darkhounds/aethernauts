var sinon = require('sinon');

var EventManager = require('./../../mockups/component/event-manager.mock');

var WaterlineConfig = require('./../../mockups/object/waterline-config.mock');
var ServerConfig = require('./../../mockups/object/server-config.mock');
var Cypher = require('./../../mockups/component/cypher.mock');
var DataStorage = require('./../../mockups/component/data-storage.mock');
var UsersModel = require('./../../mockups/model/users-model.mock');

var HTTPRequestRouter = require('./../../mockups/route/http-request-router.mock');
var DataRouter = require('./../../mockups/route/data-router.mock');

describe('The Main Controller class', function () {
	var MainController, sandbox, consoleLog, port, root;

	beforeEach(function () {
		port = 999;
		root = 'bogus';
		sandbox = sinon.sandbox.create();
		consoleLog = sandbox.stub(console, 'log');
		EventManager.mockStart();
		WaterlineConfig.mockStart();
		ServerConfig.mockStart();
		Cypher.mockStart();
		DataStorage.mockStart();
		UsersModel.mockStart();
		HTTPRequestRouter.mockStart();
		DataRouter.mockStart();
		MainController = require('./../../../../src/server/controller/main-controller');
	});

	afterEach(function () {
		DataRouter.mockStop();
		HTTPRequestRouter.mockStop();
		UsersModel.mockStop();
		DataStorage.mockStop();
		Cypher.mockStop();
		ServerConfig.mockStop();
		WaterlineConfig.mockStop();
		EventManager.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		MainController.should.be.a('function');
	});

	it('should create a new WaterlineConfig', function () {
		var instance = new MainController(port, root);

		WaterlineConfig.should.have.been.calledWith(root + '/data/');
	});

	it('should create a new DataStorage', function () {
		var instance = new MainController(port, root);

		DataStorage.should.have.been.calledOnce;
	});

	it('should create a new DataStorage with the WaterlineConfig instance', function () {
		var spy = sandbox.spy(DataStorage.prototype, 'setup');
		var instance = new MainController(port, root);

		spy.should.have.been.calledWith(WaterlineConfig.getInstance());
	});

	it('should create a new UserModel', function () {
		var instance = new MainController(port, root);

		UsersModel.should.have.been.calledWithNew;
	});

	it('should create the UserModel with the expected data', function () {
		var instance = new MainController(port, root);

		UsersModel.should.have.been.calledWith(ServerConfig.getInstance().defaultUsers);
	});

	it('should register a new UserModel under "users" name with the DataStorage', function () {
		var spy = sandbox.spy(DataStorage.prototype, 'addModel');
		var instance = new MainController(port, root);

		spy.should.have.been.calledWith('users', UsersModel.getInstance());
	});

	it('should create a new ServerConfig', function () {
		var instance = new MainController(port, root);

		ServerConfig.should.have.been.calledWith(root, port);
	});

	it('should create a new Cypher', function () {
		var instance = new MainController(port, root);

		Cypher.should.have.been.calledOnce;
	});

	it('should encrypt all the default users passwords', function () {
		var defaultUsersBeforeCypher = [
			{password: 'bogus1'},
			{password: 'bogus2'}
		];
		var defaultUsersAfterCypher = [
			{password: 'encryptedBogus1'},
			{password: 'encryptedBogus2'}
		];

		ServerConfig.setDefaultUsers(defaultUsersBeforeCypher);
		Cypher.addResponse('encryptedBogus1');
		Cypher.addResponse('encryptedBogus2');
		var instance = new MainController(port, root);

		ServerConfig.getInstance().defaultUsers.should.eql(defaultUsersAfterCypher);
	});

	it('should create a new Cypher with the ServerConfig instance', function () {
		var spy = sandbox.spy(Cypher.prototype, 'setup');
		var instance = new MainController(port, root);

		spy.should.have.been.calledWith(ServerConfig.getInstance());
	});

	it('should create a new HTTPRequestRouter', function () {
		var instance = new MainController(port, root);

		HTTPRequestRouter.should.have.been.calledWithNew
	});

	it('should inject the EventManager and DataStorage into the new HTTPRequestRouter', function () {
		var instance = new MainController(port, root);

		HTTPRequestRouter.should.have.been.calledWith(EventManager.getInstance(), DataStorage.getInstance(), Cypher.getInstance());
	});

	it('should create a new HTTPRequestRouter with the ServerConfig and Cypher', function () {
		var spy = sandbox.spy(HTTPRequestRouter.prototype, 'setup');
		var instance = new MainController(port, root);

		spy.should.have.been.calledWith(ServerConfig.getInstance());
	});

	it('should create a new DataRouter', function () {
		var instance = new MainController(port, root);

		DataRouter.should.have.been.calledWith(EventManager.getInstance(), DataStorage.getInstance(), Cypher.getInstance());
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new MainController(port, root);
		});

		it('should be an instance of', function () {
			instance.should.be.an.instanceOf(MainController);
		});

		it('should connect', function () {
			DataStorage.addResponse(null, {});
			HTTPRequestRouter.addResponse(null, {});

			return instance.connect();
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
