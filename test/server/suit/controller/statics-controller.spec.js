var sinon = require('sinon');

var Express = require('./../../mockups/express.mock');
var StaticsServerConfig = require('./../../mockups/object/statics-server-config.mock');
var StaticsRouter = require('./../../mockups/component/statics-router/statics-router.mock');

describe('The StaticsController class', function () {
	var StaticsController, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		Express.mockStart();
		StaticsRouter.mockStart();
		StaticsServerConfig.mockStart();
		StaticsController = require('./../../../../src/server/controller/statics-controller');
	});
	afterEach(function () {
		StaticsServerConfig.mockStop();
		StaticsRouter.mockStop();
		Express.mockStop();
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance, express, consoleLog;
		var root = 'root/';
		var port = 3000;

		beforeEach(function () {
			instance = new StaticsController(root, port);
			express = Express.getInstance();
			consoleLog = sandbox.stub(console, 'log');
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "StaticsController"', function () {
			instance.should.be.an.instanceof(StaticsController);
		});

		it ('should connect when disconnected', function () {
			instance.connect();

			consoleLog.withArgs(StaticsController.MESSAGE_START).should.have.been.calledOnce;
		});

		it ('should fail silently when connecting while already connected', function () {
			instance.connect();
			instance.connect();

			consoleLog.withArgs(StaticsController.MESSAGE_START).should.have.been.calledOnce;
		});

		it ('should invoke the addLogger method of the statics-router when connecting', function () {
			var staticsController = StaticsRouter.getInstance();
			var spy = sandbox.spy(staticsController, 'addLogger');

			instance.connect();

			spy.should.have.been.calledOnce;
		});

		it ('should invoke the addStaticAssets method of the statics-router when connecting', function () {
			var staticServerConfig = StaticsServerConfig.getInstance();
			var staticsController = StaticsRouter.getInstance();
			var spy = sandbox.spy(staticsController, 'addStaticAssets');

			instance.connect();

			spy.should.have.been.calledWith(staticServerConfig.statics);
		});

		it ('should invoke the addStaticFavicon method of the statics-router when connecting', function () {
			var staticServerConfig = StaticsServerConfig.getInstance();
			var staticsController = StaticsRouter.getInstance();
			var spy = sandbox.spy(staticsController, 'addStaticFavicon');

			instance.connect();

			spy.should.have.been.calledWith(staticServerConfig.data);
		});

		it ('should invoke the addSaveFormHistory method of the statics-router when connecting', function () {
			var staticsController = StaticsRouter.getInstance();
			var spy = sandbox.spy(staticsController, 'addSaveFormHistory');

			instance.connect();

			spy.should.have.been.calledOnce;
		});

		it ('should invoke the addStaticIndex method of the statics-router when connecting', function () {
			var staticServerConfig = StaticsServerConfig.getInstance();
			var staticsController = StaticsRouter.getInstance();
			var spy = sandbox.spy(staticsController, 'addStaticIndex');

			instance.connect();

			spy.should.have.been.calledWith(staticServerConfig.index);
		});
	});
});
