var sinon = require('sinon');

var WebscoketServerConfig = require('./../../mockups/object/websocket-server-config.mock.js');
var waterlineConfig = require('./../../mockups/object/waterline-config.mock');
var ws = require('./../../mockups/ws.mock');
var Socket = require('./../../mockups/socket.mock');
var Waterline = require('./../../mockups/waterline');
var SocketsRouter = require('./../../mockups/component/sockets-router/sockets-router.mock');
var UsersModel = require('./../../mockups/model/users-model.mock');

describe('The Websocket Controller class', function () {
	var WebsocketController, sandbox;
	
	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		SocketsRouter.mockStart();
		Waterline.mockStart();
		WebscoketServerConfig.mockStart();
		waterlineConfig.mockStart();
		UsersModel.mockStart();
		ws.mockStart();
		WebsocketController = require('./../../../../src/server/controller/websocket-controller');
	});
	afterEach(function () {
		ws.mockStop();
		UsersModel.mockStop();
		WebscoketServerConfig.mockStop();
		Waterline.mockStop();
		waterlineConfig.mockStop();
		SocketsRouter.mockStop();
		sandbox.restore();
	});

	it ('should be a function', function () {
		WebsocketController.should.be.a('function');
	});

	it ('should create an websocket server config object with the expected port', function () {
		var port = 999;

		new WebsocketController(port);

		WebscoketServerConfig.getInstance().port.should.equal(port);
	});

	describe('as an instance', function () {
		var instance, port, consoleLog;

		beforeEach(function () {
			port = 999;
			instance = new WebsocketController(port);
			consoleLog = sandbox.stub(console, 'log');
		});
		afterEach(function () {
			instance = null;
		});

		it ('should be an instance of "WebsocketController"', function () {
			instance.should.be.an.instanceof(WebsocketController);
		});

		it ('should create a websocket server when connecting', function (done) {
			var spy = sandbox.spy(ws.getInstance(), 'Server');

			instance.connect().finally(function () {
				spy.should.have.been.called;
				done();
			});
		});

		it ('should reject the promise when connecting while already connected', function (done) {
			instance.connect();
			instance.connect().catch(function () {
				done();
			});
		});

		describe('after connecting', function () {
			var server;

			beforeEach(function (done) {
				UsersModel.addResponse(null, {});
				instance.connect().then(function () {
					server = ws.getInstance().Server.getInstance();
					done();
				});
			});
			afterEach(function () {});

			it('should register new sockets with the sockets-router when they connect', function () {
				var spy = sandbox.spy(SocketsRouter.getInstance(), 'registerSocket');
				var socket = new Socket();

				server.emit('connection', socket);

				spy.should.have.been.calledWith(socket).once;
			});
		});
	});
});
