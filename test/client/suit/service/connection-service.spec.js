var sinon = require('sinon');

var EventEmitter = require('events').EventEmitter;

var connectionEvents = require('./../../../../src/client/js/event/connection-events');
var connectionService = require('./../../../../src/client/js/service/connection-service');

describe('The ConnectionService singleton', function () {
	var sandbox, url;

	beforeEach(function() {
		url = 'localhost:3002';
		sandbox = sinon.sandbox.create();
		connectionService.setup(url);
	});
	afterEach(function() {
		sandbox.restore();
	});

	it ('should be an "Object"', function () {
		connectionService.should.be.an.instanceof(Object);
	});

	it ('should be an instance of "EventEmitter"', function () {
		connectionService.should.be.an.instanceof(EventEmitter);
	});

	it('should create a websocket when opening a connection', function () {
		var spy = sandbox.spy(global, 'WebSocket');

		connectionService.open();

		spy.should.have.been.calledWith(url);
	});

	it('should not create a websocket when already connected', function () {
		connectionService.open();

		var spy = sandbox.spy(global, 'WebSocket');
		connectionService.open();

		spy.should.not.have.been.called;
	});

	it('should be able to silently close a connection without opening it', function () {
		connectionService.close();
	});

	it('should be able to silently close a connection after opening it', function () {
		connectionService.open();
		connectionService.close();
	});

	it('should trigger a logout event after disconnecting', function () {
		var spy = sandbox.spy();

		connectionService.on(connectionEvents.CLOSED, spy);
		connectionService.close();

		spy.should.have.been.calledOnce;
	});

	it('should return false to calls on the "send" method while not connected', function () {
		var result = connectionService.send();
		result.should.be.false;
	});

	describe('after opening a connection', function () {
		var username, password, websocket, clock;

		beforeEach(function () {
			username = 'foo';
			password = 'bar';
			connectionService.open(username, password);
			clock = sandbox.useFakeTimers();

			websocket = WebSocket.getInstance();
		});
		afterEach(function () {
			connectionService.close();
		});

		it('should trigger a connection error event when the websocket fails to connect without a token', function () {
			var spy = sandbox.spy();

			connectionService.on(connectionEvents.CONNECTION_ERROR, spy);
			websocket.dispatchEvent('error', {});

			spy.should.have.been.calledOnce;
		});

		it('should not trigger a connection error when the websocket fails to connect with a token', function () {
			var spy = sandbox.spy();
			var token = 'bogus';
			var data = JSON.stringify({command: 'authentication', valid: true, token: token});

			connectionService.on(connectionEvents.CONNECTION_ERROR, spy);
			websocket.dispatchEvent('message', {data: data});
			websocket.dispatchEvent('error', {});

			spy.should.not.have.been.called;
		});

		it('should try to reconnect on a connection error with a token after the default delay', function () {
			var spy = sandbox.spy(connectionService, 'open');
			var token = 'bogus';
			var data = JSON.stringify({command: 'authentication', valid: true, token: token});

			websocket.dispatchEvent('message', {data: data});
			websocket.dispatchEvent('error', {});
			clock.tick(connectionService.DEFAULT_DELAY);

			spy.should.have.been.calledWith(username);
		});

		it('should be able to open the connection again after a connection error', function () {
			var spy = sandbox.spy(global, 'WebSocket');

			websocket.dispatchEvent('error', {});
			connectionService.open();

			spy.should.have.been.calledWith(url);
		});

		it('should trigger a connection error event when the connection closes without a token', function () {
			var spy = sandbox.spy();

			connectionService.on(connectionEvents.CONNECTION_ERROR, spy);
			websocket.dispatchEvent('open', {});
			websocket.dispatchEvent('close', {});

			spy.should.have.been.calledOnce;
		});

		it('should not trigger a disconnected event when the connection closes without a token', function () {
			var spy = sandbox.spy();

			connectionService.on(connectionEvents.DISCONNECTED, spy);
			websocket.dispatchEvent('open', {});
			websocket.dispatchEvent('close', {});

			spy.should.not.have.been.called;
		});

		it('should send an authentication request after the websocket is opened', function () {
			var spy = sandbox.spy(websocket, 'send');
			var data = {
				command: 'authentication',
				username: username,
				password: password
			};

			websocket.dispatchEvent('open', {});

			spy.should.have.been.calledWith(JSON.stringify(data));
		});

		it('should trigger an authentication error after a failed authentication', function () {
			var spy = sandbox.spy();
			var data = JSON.stringify({command: 'authentication', valid: false});

			connectionService.on(connectionEvents.AUTHENTICATION_ERROR, spy);
			websocket.dispatchEvent('open', {});
			websocket.dispatchEvent('message', {data: data});

			spy.should.have.been.calledOnce;
		});

		it('should trigger a message error after receiving an unknown message command', function () {
			var spy = sandbox.spy();
			var data = JSON.stringify({command: 'bogus'});

			connectionService.on(connectionEvents.MESSAGE_ERROR, spy);
			websocket.dispatchEvent('open', {});
			websocket.dispatchEvent('message', {data: data});

			spy.should.have.been.calledOnce;
		});

		it('should be able to open the connection again after an authentication error', function () {
			var spy = sandbox.spy(global, 'WebSocket');
			var data = JSON.stringify({command: 'authentication', valid: false});

			websocket.dispatchEvent('open', {});
			websocket.dispatchEvent('message', {data: data});
			connectionService.open();

			spy.should.have.been.calledWith(url);
		});

		it('should trigger a logged in event after a successful authentication', function () {
			var spy = sandbox.spy();
			var token = 'bogus';
			var data = JSON.stringify({command: 'authentication', valid: true, token: token});

			connectionService.on(connectionEvents.OPENED, spy);
			websocket.dispatchEvent('open', {});
			websocket.dispatchEvent('message', {data: data});

			spy.should.have.been.calledWith(username, token);
		});

		describe('and authenticated', function () {
			var token, data;

			beforeEach(function () {
				token = 'bogus';
				data = JSON.stringify({command: 'authentication', valid: true, token: token});

				websocket.dispatchEvent('open', {});
				websocket.dispatchEvent('message', {data: data});
			});
			afterEach(function () {});

			it('should trigger a disconnect event when the connection closes with a token', function () {
				var spy = sandbox.spy();

				connectionService.on(connectionEvents.DISCONNECTED, spy);
				websocket.dispatchEvent('close', {});

				spy.should.have.been.calledOnce;
			});

			it('should try to reconnect after the connection closes with a token after the default delay', function () {
				var spy = sandbox.spy(global, 'WebSocket');

				websocket.dispatchEvent('close', {});
				clock.tick(connectionService.DEFAULT_DELAY);

				spy.should.have.been.calledWith(url);
			});

			it('should send an reconnection request after the websocket is reopened', function () {
				websocket.dispatchEvent('close', {});
				clock.tick(connectionService.DEFAULT_DELAY);
				websocket = WebSocket.getInstance();

				var spy = sandbox.spy(websocket, 'send');
				var data ={
					command: 'reconnection',
					username: username,
					token: token
				};

				websocket.dispatchEvent('open', {});

				spy.should.have.been.calledWith(JSON.stringify(data));
			});

			it('should trigger the reconnected event after reconnecting successfully', function () {
				var spy = sandbox.spy();
				data = JSON.stringify({command: 'reconnected', valid: true});

				connectionService.on(connectionEvents.RECONNECTED, spy);
				websocket.dispatchEvent('close', {});
				clock.tick(connectionService.DEFAULT_DELAY);
				websocket = WebSocket.getInstance();
				websocket.dispatchEvent('open', {});
				websocket.dispatchEvent('message', {data: data});

				spy.should.have.been.calledOnce;
			});

			it('should trigger the authentication error event after reconnecting unsuccessfully', function () {
				var spy = sandbox.spy();
				data = JSON.stringify({command: 'reconnected', valid: false});

				connectionService.on(connectionEvents.AUTHENTICATION_ERROR, spy);
				websocket.dispatchEvent('close', {});
				clock.tick(connectionService.DEFAULT_DELAY);
				websocket = WebSocket.getInstance();
				websocket.dispatchEvent('open', {});
				websocket.dispatchEvent('message', {data: data});

				spy.should.have.been.calledOnce;
			});

			it('should return true to calls on the "send" method while connected', function () {
				var result = connectionService.send();
				result.should.be.true;
			});

			it('should relay message objects through the websocket when send is invoked as a json string', function () {
				var id = 'bogus';
				var data = {foo: 'bar'};
				var package = {
					command: 'message',
					id: id,
					data: data
				};
				var spy = sandbox.spy(websocket, 'send');

				connectionService.send(data, id);

				spy.should.have.been.calledWith(JSON.stringify(package));
			});

			it('should trigger the message event when receiving messages from th websocket', function () {
				var spy = sandbox.spy();
				var id = 'bogus';
				var data = {foo: 'bar'};
				var package = {
					command: 'message',
					id: id,
					data: data
				};

				connectionService.on(connectionEvents.MESSAGE, spy);
				websocket.dispatchEvent('message', {data: JSON.stringify(package)});

				spy.should.have.been.calledWith(id, data);
			});
		});
	});
});
