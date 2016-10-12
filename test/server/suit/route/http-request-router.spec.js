var sinon = require('sinon');

var express = require('./../../mockups/express.mock');
var expressWs = require('./../../mockups/express-ws.mock');
var ServerConfig = require('./../../mockups/object/server-config.mock');

var LoggerRoute = require('./../../mockups/route/statics/log-route.mock');
var StaticAssetsRoute = require('./../../mockups/route/statics/static-assets-route.mock');
var FaviconRoute = require('./../../mockups/route/statics/favicon-route.mock');
var SaveFormHistoryRoute = require('./../../mockups/route/statics/save-form-history-route.mock');
var StaticIndexRoute = require('./../../mockups/route/statics/static-index-route.mock');
var WebsocketRoute = require('./../../mockups/route/statics/websocket-route.mock');

describe('The HTTP Request Router class', function () {
	var HTTPRequestRouter, sandbox, consoleLog;
	var port = 999;
	var root = 'bogus';

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		consoleLog = sandbox.stub(console, 'log');
		express.mockStart();
		expressWs.mockStart();
		ServerConfig.mockStart();
		LoggerRoute.mockStart();
		StaticAssetsRoute.mockStart();
		FaviconRoute.mockStart();
		SaveFormHistoryRoute.mockStart();
		StaticIndexRoute.mockStart();
		WebsocketRoute.mockStart();
		HTTPRequestRouter = require('./../../../../src/server/route/http-request-router');
	});
	afterEach(function () {
		WebsocketRoute.mockStop();
		StaticIndexRoute.mockStop();
		SaveFormHistoryRoute.mockStop();
		FaviconRoute.mockStop();
		StaticAssetsRoute.mockStop();
		LoggerRoute.mockStop();
		ServerConfig.mockStop();
		expressWs.mockStop();
		express.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		HTTPRequestRouter.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new HTTPRequestRouter();
		});

		it('should be an instance of HTTPRequestRouter', function () {
			instance.should.be.an.instanceOf(HTTPRequestRouter);
		});

		it('should create a new ServerConfig with the expected arguments when invoking the setup', function () {
			instance.setup(port, root);

			ServerConfig.should.have.been.calledWith(root, port);
		});

		it('should setup the LoggerRoute with the config created by the setup', function () {
			var spy = sandbox.spy(LoggerRoute.getInstance(), 'setup');

			instance.setup(port, root);
			var config = ServerConfig.getInstance();

			spy.should.have.been.calledWith(config);
		});

		it('should setup the StaticAssetsRoute with the config created by the setup', function () {
			var spy = sandbox.spy(StaticAssetsRoute.getInstance(), 'setup');

			instance.setup(port, root);
			var config = ServerConfig.getInstance();

			spy.should.have.been.calledWith(config);
		});

		it('should setup the FaviconRoute with the config created by the setup', function () {
			var spy = sandbox.spy(FaviconRoute.getInstance(), 'setup');

			instance.setup(port, root);
			var config = ServerConfig.getInstance();

			spy.should.have.been.calledWith(config);
		});

		it('should setup the SaveFormHistoryRoute with the config created by the setup', function () {
			var spy = sandbox.spy(SaveFormHistoryRoute.getInstance(), 'setup');

			instance.setup(port, root);
			var config = ServerConfig.getInstance();

			spy.should.have.been.calledWith(config);
		});

		it('should setup the StaticIndexRoute with the config created by the setup', function () {
			var spy = sandbox.spy(StaticIndexRoute.getInstance(), 'setup');

			instance.setup(port, root);
			var config = ServerConfig.getInstance();

			spy.should.have.been.calledWith(config);
		});

		it('should setup the WebsocketRoute with the config created by the setup', function () {
			var spy = sandbox.spy(WebsocketRoute.getInstance(), 'setup');

			instance.setup(port, root);
			var config = ServerConfig.getInstance();

			spy.should.have.been.calledWith(config);
		});

		it('should set the server t listen on the expected port when initializing', function (done) {
			var spy = sandbox.spy(express.getInstance(), 'listen');

			instance.setup(port, root);
			instance.initialize().finally(function () {
				var config = ServerConfig.getInstance();
				spy.should.have.been.calledWith(config.port);
				done();
			});
		});

		it('should fail silently when initializing multiple times', function (done) {
			instance.setup(port, root);
			instance.initialize().then(instance.initialize.bind(instance)).catch(function (error) {
				error.should.equal(HTTPRequestRouter.ALREADY_INITIALIZED);
				done();
			});
		});
	});
});
