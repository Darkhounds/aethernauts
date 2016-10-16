var sinon = require('sinon');

var ConnectionEvent = require('./../../../../src/client/js/event/connection-event');
var Websocket = require('./../../mockups/websocket');

describe('The Connection Service class', function () {
	var ConnectionService, sandbox;
	var url = 'localhost:3001/server';
	var username = 'foo';
	var password = 'bar';

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		Websocket.mockStart();
		ConnectionService = require('./../../../../src/client/js/service/connection-service');
	});

	afterEach(function() {
		Websocket.mockStop();
		sandbox.restore();
	});

	it ('should be an "function"', function () {
		ConnectionService.should.be.a('function');
	});

	describe('as an instance', function() {
		var instance;

		beforeEach(function () {
			instance = new ConnectionService();
			instance.setup(url);
		});

		afterEach(function () {

		});

		it('should be an instance of', function () {
			instance.should.be.an.instanceOf(ConnectionService);
		});

		it('should create a websocket when opening a connection', function () {
			instance.open();

			WebSocket.should.have.been.calledWith(url);
		});

		it('should not create a websocket when already connected', function () {
			instance.open();
			instance.open();

			Websocket.should.have.been.calledOnce;
		});

		it('should be able to silently close a connection without opening it', function () {
			instance.close();
		});

		it('should be able to silently close a connection after opening it', function () {
			instance.open();
			instance.close();
		});

		it('should trigger a logout event after disconnecting', function () {
			var spy = sandbox.spy();

			instance.on(ConnectionEvent.CLOSED, spy);
			instance.close();

			spy.should.have.been.calledOnce;
		});

		it('should return false to calls on the "send" method while not connected', function () {
			var result = instance.send();
			result.should.be.false;
		});

		describe('after opening a connection', function () {
			var websocket, clock;

			beforeEach(function () {
				instance.open(username, password);
				clock = sandbox.useFakeTimers();

				websocket = Websocket.getInstance();
			});

			afterEach(function () {
				instance.close();
			});

			it('should trigger a connection error event when the websocket fails to connect without a token', function () {
				var spy = sandbox.spy();

				instance.on(ConnectionEvent.CONNECTION_ERROR, spy);
				websocket.dispatchEvent('error', {});

				spy.should.have.been.calledOnce;
			});

			it('should not trigger a connection error when the websocket fails to connect with a token', function () {
				var spy = sandbox.spy();
				var token = 'bogus';
				var data = JSON.stringify({command: 'authentication', valid: true, token: token});

				instance.on(ConnectionEvent.CONNECTION_ERROR, spy);
				websocket.dispatchEvent('message', {data: data});
				websocket.dispatchEvent('error', {});

				spy.should.not.have.been.called;
			});

			it('should not try to reconnect before the default delay', function () {
				var spy = sandbox.spy(instance, 'open');
				var token = 'bogus';
				var data = JSON.stringify({command: 'authentication', valid: true, token: token});

				websocket.dispatchEvent('message', {data: data});
				websocket.dispatchEvent('error', {});
				clock.tick(instance.DEFAULT_DELAY - 1);

				spy.should.not.have.been.called;
			});

			it('should try to reconnect on a connection error with a token after the default delay', function () {
				var spy = sandbox.spy(instance, 'open');
				var token = 'bogus';
				var data = JSON.stringify({command: 'authentication', valid: true, token: token});

				websocket.dispatchEvent('message', {data: data});
				websocket.dispatchEvent('error', {});
				clock.tick(ConnectionService.DEFAULT_DELAY);

				spy.should.have.been.calledWith(username);
			});

			it('should be able to open the connection again after a connection error', function () {
				websocket.dispatchEvent('error', {});
				instance.open();

				Websocket.should.have.been.calledWith(url);
			});

			it('should trigger a connection error event when the connection closes without a token', function () {
				var spy = sandbox.spy();

				instance.on(ConnectionEvent.CONNECTION_ERROR, spy);
				websocket.dispatchEvent('open', {});
				websocket.dispatchEvent('close', {});

				spy.should.have.been.calledOnce;
			});

			it('should not trigger a disconnected event when the connection closes without a token', function () {
				var spy = sandbox.spy();

				instance.on(ConnectionEvent.DISCONNECTED, spy);
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

				instance.on(ConnectionEvent.AUTHENTICATION_ERROR, spy);
				websocket.dispatchEvent('open', {});
				websocket.dispatchEvent('message', {data: data});

				spy.should.have.been.calledOnce;
			});

			it('should trigger a message error after receiving an unknown message command', function () {
				var spy = sandbox.spy();
				var data = JSON.stringify({command: 'bogus'});

				instance.on(ConnectionEvent.MESSAGE_ERROR, spy);
				websocket.dispatchEvent('open', {});
				websocket.dispatchEvent('message', {data: data});

				spy.should.have.been.calledOnce;
			});

			it('should be able to open the connection again after an authentication error', function () {
				var data = JSON.stringify({command: 'authentication', valid: false});

				websocket.dispatchEvent('open', {});
				websocket.dispatchEvent('message', {data: data});
				instance.open();

				Websocket.should.have.been.calledWith(url);
			});

			it('should trigger a logged in event after a successful authentication', function () {
				var spy = sandbox.spy();
				var token = 'bogus';
				var data = JSON.stringify({command: 'authentication', valid: true, token: token});

				instance.on(ConnectionEvent.OPENED, spy);
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

					instance.on(ConnectionEvent.DISCONNECTED, spy);
					websocket.dispatchEvent('close', {});

					spy.should.have.been.calledOnce;
				});

				it('should try to reconnect after the connection closes with a token after the default delay', function () {
					websocket.dispatchEvent('close', {});
					clock.tick(ConnectionService.DEFAULT_DELAY);

					Websocket.should.have.been.calledWith(url);
				});

				it('should send an reconnection request after the websocket is reopened', function () {
					websocket.dispatchEvent('close', {});
					clock.tick(ConnectionService.DEFAULT_DELAY);
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

					instance.on(ConnectionEvent.RECONNECTED, spy);
					websocket.dispatchEvent('close', {});
					clock.tick(ConnectionService.DEFAULT_DELAY);
					websocket = WebSocket.getInstance();
					websocket.dispatchEvent('open', {});
					websocket.dispatchEvent('message', {data: data});

					spy.should.have.been.calledOnce;
				});

				it('should trigger the authentication error event after reconnecting unsuccessfully', function () {
					var spy = sandbox.spy();
					data = JSON.stringify({command: 'reconnected', valid: false});

					instance.on(ConnectionEvent.AUTHENTICATION_ERROR, spy);
					websocket.dispatchEvent('close', {});
					clock.tick(ConnectionService.DEFAULT_DELAY);
					websocket = WebSocket.getInstance();
					websocket.dispatchEvent('open', {});
					websocket.dispatchEvent('message', {data: data});

					spy.should.have.been.calledOnce;
				});

				it('should return true to calls on the "send" method while connected', function () {
					var result = instance.send();
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

					instance.send(data, id);

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

					instance.on(ConnectionEvent.MESSAGE, spy);
					websocket.dispatchEvent('message', {data: JSON.stringify(package)});

					spy.should.have.been.calledWith(id, data);
				});
			});
		});
	});
});
