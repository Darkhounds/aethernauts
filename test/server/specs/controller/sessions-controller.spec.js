var sinon = require('sinon');

var EventManager = require('./../../mockups/service/event-manager.mock');
var Sessions = require('./../../mockups/service/sessions.mock');
var Cypher = require('./../../mockups/service/cypher.mock');
var Socket = require('./../../mockups/socket.mock');

var SocketEvent = require('./../../../../src/server/event/socket-event');

describe('The Sessions Controller class', function () {
	var SessionsController, sandbox, clock, eventManager, sessions, cypher, socket, username, user;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		clock = sandbox.useFakeTimers();

		eventManager = new EventManager();
		sessions = new Sessions();
		cypher = new Cypher();
		socket = new Socket();

		username = 'bogus';
		user = {
			username: username
		};
		socket.user = user;

		SessionsController = require('./../../../../src/server/controller/sessions-controller');
	});

	afterEach(function () {
		EventManager.restore();
		Sessions.restore();
		Cypher.restore();
		sandbox.restore();
	});

	it('should be a function', function () {
		SessionsController.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new SessionsController(eventManager, sessions, cypher);
		});

		it('should be an instance of the ConnectionsController class', function () {
			instance.should.be.an.instanceOf(SessionsController);
		});

		it('should initiate a timer on initializatio', function () {
			var spy = sandbox.spy(global, 'setInterval');

			instance.initialize();

			spy.getCall(0).args[1].should.equal(SessionsController.SOCKET_CHECK_INTERVAL * 1000);
		});

		it('should not initialize more then once', function () {
			var spy = sandbox.spy(global, 'setInterval');

			instance.initialize();
			instance.initialize();

			spy.should.have.been.calledOnce;
		});

		describe('after initialing', function () {

			beforeEach(function () {
				instance.initialize();
			});

			it('should inject a new mask into the socket after opening a new connection', function () {
				var expectedMask = 'bogus';

				sandbox.stub(console, 'log');
				Cypher.addResponse(expectedMask);
				eventManager.emit(SocketEvent.OPENED, socket);

				socket.mask.should.equal(expectedMask);
			});

			it('should send the expected message to the socket after opening a new connection', function () {
				var spy = sandbox.spy(socket, 'send');
				var mask = 'bogus';
				var data = {command: 'handshake', mask: mask, timeout: SessionsController.SOCKET_CHECK_INTERVAL};
				var expectedMessage = JSON.stringify(data);

				sandbox.stub(console, 'log');
				Cypher.addResponse(mask);
				eventManager.emit(SocketEvent.OPENED, socket);

				spy.should.have.been.calledWith(expectedMessage);
			});

			it('should register a new connection after authenticating', function () {
				var spy = sandbox.spy(sessions, 'add');

				eventManager.emit(SocketEvent.AUTHENTICATED, socket);

				spy.should.have.been.calledWith(socket);
			});

			it('should change the connection checked state to true after a pong message', function () {
				var session = {};

				Sessions.addResponse(session);

				eventManager.emit(SocketEvent.PONG, socket);

				session.checked.should.be.true;
			});

			it('should output a log message when receiving a regular message', function () {
				var spy = sandbox.stub(console, 'log');

				socket.upgradeReq = {
					connection: {
						remoteAddress: 'bogus'
					}
				};
				eventManager.emit(SocketEvent.MESSAGE, socket);

				spy.should.have.been.calledOnce;
			});

			it('should not output log messages when receiving a pong message', function () {
				var spy = sandbox.stub(console, 'log');

				eventManager.emit(SocketEvent.MESSAGE, socket, '{"command":"pong"}');

				spy.should.not.have.been.called;
			});

			it('should unregister a session when it closes', function () {
				var spy = sandbox.spy(sessions, 'remove');

				sandbox.stub(console, 'log');
				eventManager.emit(SocketEvent.CLOSED, socket);

				spy.should.have.been.calledWith(socket).calledOnce;
			});

			it('should not check existing sessions before expected delay', function () {
				var spy = sandbox.stub(sessions, 'forEach');
				var beforeTrigger = (SessionsController.SOCKET_CHECK_INTERVAL * 1000) - 1;

				clock.tick(beforeTrigger);

				spy.should.not.have.been.called;
			});

			it('should check existing sessions after expected delay', function () {
				var spy = sandbox.stub(sessions, 'forEach');
				var afterTrigger = (SessionsController.SOCKET_CHECK_INTERVAL * 1000);

				clock.tick(afterTrigger);

				spy.should.have.been.called;
			});

			it('should send a ping message to each registered session', function () {
				var spy = sandbox.spy(socket, 'send');
				var afterTrigger = (SessionsController.SOCKET_CHECK_INTERVAL * 1000);
				var session1 = {socket: socket, checked: true};
				var session2 = {socket: socket, checked: true};
				var session3 = {socket: socket, checked: true};

				Sessions.addSession('bogus1', session1);
				Sessions.addSession('bogus2', session2);
				Sessions.addSession('bogus3', session3);
				clock.tick(afterTrigger);

				spy.should.have.been.calledWith(JSON.stringify({command: 'ping'}));
			});

			it('should emit a close event on a connection when it timesout', function () {
				var spy = sandbox.spy(socket, 'emit');
				var afterTrigger = (SessionsController.SOCKET_CHECK_INTERVAL * 1000);
				var session = {socket: socket, checked: false};

				Sessions.addSession('bogus', session);
				clock.tick(afterTrigger);

				spy.should.have.been.calledWith('close', socket).calledOnce;
			});

			it('should close a connection when it timesout', function () {
				var spy = sandbox.spy(socket, 'close');
				var afterTrigger = (SessionsController.SOCKET_CHECK_INTERVAL * 1000);
				var session = {socket: socket, checked: false};

				Sessions.addSession('bogus', session);
				clock.tick(afterTrigger);

				spy.should.have.been.calledOnce;
			});
		});
	});
});