var sinon = require('sinon');

var express = require('./../../mockups/express.mock');
var expressWs = require('./../../mockups/express-ws.mock');

var EventManager = require('./../../mockups/services/event-manager.mock');
var DataStorage = require('./../../mockups/services/data-storage.mock');
var Cypher = require('./../../mockups/services/cypher.mock');
var ServerConfig = require('./../../mockups/objects/server-config.mock');

var RegisterRoute = require('./../../mockups/routers/statics/register-route.mock');
var LoggerRoute = require('./../../mockups/routers/statics/log-route.mock');
var StaticAssetsRoute = require('./../../mockups/routers/statics/static-assets-route.mock');
var FaviconRoute = require('./../../mockups/routers/statics/favicon-route.mock');
var SaveFormHistoryRoute = require('./../../mockups/routers/statics/save-form-history-route.mock');
var StaticIndexRoute = require('./../../mockups/routers/statics/static-index-route.mock');
var WebsocketRoute = require('./../../mockups/routers/statics/websocket-route.mock');

describe('The HTTP Request Router class', function () {
	var HTTPRequestRouter, sandbox, consoleLog, port, eventManager, dataStorage, cypher, config;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		port = 999;
		consoleLog = sandbox.stub(console, 'log');
		eventManager = new EventManager();
		dataStorage = new DataStorage();
		cypher = new Cypher();
		config = new ServerConfig();

		express.mockStart();
		expressWs.mockStart();
		LoggerRoute.mockStart();
		StaticAssetsRoute.mockStart();
		FaviconRoute.mockStart();
		SaveFormHistoryRoute.mockStart();
		StaticIndexRoute.mockStart();
		WebsocketRoute.mockStart();
		RegisterRoute.mockStart();

		HTTPRequestRouter = require('./../../../../src/server/routers/http-request-router');
	});

	afterEach(function () {
		RegisterRoute.mockStop();
		WebsocketRoute.mockStop();
		StaticIndexRoute.mockStop();
		SaveFormHistoryRoute.mockStop();
		FaviconRoute.mockStop();
		StaticAssetsRoute.mockStop();
		LoggerRoute.mockStop();
		expressWs.mockStop();
		express.mockStop();

		EventManager.restore();
		DataStorage.restore();
		Cypher.restore();
		ServerConfig.restore();
		sandbox.restore();
	});

	it('should be a function', function () {
		HTTPRequestRouter.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new HTTPRequestRouter(eventManager, dataStorage, cypher);
		});

		it('should be an instance of HTTPRequestRouter', function () {
			instance.should.be.an.instanceOf(HTTPRequestRouter);
		});

		it('should setup the LoggerRoute with the config created by the setup', function () {
			var spy = sandbox.spy(LoggerRoute.getInstance(), 'setup');

			instance.setup(config);

			spy.should.have.been.calledWith(config);
		});

		it('should setup the StaticAssetsRoute with the config created by the setup', function () {
			var spy = sandbox.spy(StaticAssetsRoute.getInstance(), 'setup');

			instance.setup(config);

			spy.should.have.been.calledWith(config);
		});

		it('should setup the FaviconRoute with the config created by the setup', function () {
			var spy = sandbox.spy(FaviconRoute.getInstance(), 'setup');

			instance.setup(config);

			spy.should.have.been.calledWith(config);
		});

		it('should setup the SaveFormHistoryRoute with the config created by the setup', function () {
			var spy = sandbox.spy(SaveFormHistoryRoute.getInstance(), 'setup');

			instance.setup(config);

			spy.should.have.been.calledWith(config);
		});

		it('should setup the StaticIndexRoute with the config created by the setup', function () {
			var spy = sandbox.spy(StaticIndexRoute.getInstance(), 'setup');

			instance.setup(config);

			spy.should.have.been.calledWith(config);
		});

		it('should setup the WebsocketRoute with the config created by the setup', function () {
			var spy = sandbox.spy(WebsocketRoute.getInstance(), 'setup');

			instance.setup(config);

			spy.should.have.been.calledWith(config);
		});

		it('should set the server to listen on the expected port when initializing', function () {
			var spy = sandbox.spy(express.getInstance(), 'listen');

			instance.setup(config);

			return instance.initialize().then(function () {
				var config = ServerConfig.getInstance();
				spy.should.have.been.calledWith(config.port);
			});
		});

		it('should fail silently when initializing multiple times', function () {
			instance.setup(config);

			return instance.initialize().then(instance.initialize.bind(instance)).catch(function (error) {
				error.should.equal(HTTPRequestRouter.ALREADY_INITIALIZED);
			});
		});
	});
});
