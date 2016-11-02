var sinon = require('sinon');

var ConnectionEvent = require('./../../../../src/client/js/event/connection-event');
var Websocket = require('./../../mockups/websocket');
var XMLHttpRequest = require('./../../mockups/http-request');
var Cypher = require('./../../mockups/util/cypher.mock');

describe('The Connection Service class', function () {
	var ConnectionService, sandbox;
	var url = 'localhost:3001/server';
	var email = 'something@somewhere.com';
	var username = 'foo';
	var password = 'bar';
	var character = 'bogus';
	var token = 'bogus';

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		Websocket.mockStart();
		XMLHttpRequest.mockStart();
		Cypher.mockStart();
		ConnectionService = require('./../../../../src/client/js/service/connection-service');
	});

	afterEach(function() {
		Cypher.mockStop();
		XMLHttpRequest.mockStop();
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

		it('should be an instance of', function () {
			instance.should.be.an.instanceOf(ConnectionService);
		});

		it('should hit the registration endpoint', function () {
			var expected = 'email=' + email + '&username=' + username + '&password=' + password + '&character=' + character;
			var spy = sandbox.spy(XMLHttpRequest.prototype, 'send');

			instance.register(email, username, password, character);

			spy.should.have.been.calledWith(expected);
		});

		it('should fail silently while handeling another registration process', function () {
			instance.register(email, username, password, character);
			instance.register(email, username, password, character);

			XMLHttpRequest.should.have.been.calledOnce;
		});

		it('should do handle a connection error during a registration process by triggering a ConnectionEvent.CONNECTION_ERROR event', function () {
			var spy = sandbox.spy();

			instance.on(ConnectionEvent.CONNECTION_ERROR, spy);
			instance.register(email, username, password, character);

			var request = XMLHttpRequest.getInstance();
			request.emit('error');

			spy.should.have.been.calledOnce;
		});

		it('should do handle a successful registration process with a new connection', function () {
			var data = JSON.stringify({command: 'registration', valid: true, token: token});
			var spy = sandbox.spy(instance, 'open');

			instance.register(email, username, password, character);

			var request = XMLHttpRequest.getInstance();
			request.responseText = data;
			request.emit('load');

			spy.should.have.been.calledWith(username, password);
		});

		it('should do handle a unsuccessful registration process by triggering a ConnectionEvent.REGISTRATION_ERROR event', function () {
			var errors = ['email'];
			var data = JSON.stringify({command: 'registration', valid: false, errors: errors});
			var spy = sandbox.spy();

			instance.on(ConnectionEvent.REGISTRATION_ERROR, spy);
			instance.register(email, username, password, character);

			var request = XMLHttpRequest.getInstance();
			request.responseText = data;
			request.emit('load');

			spy.should.have.been.calledWith(errors);
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

			it('should send an authentication request after the handshake is received', function () {
				var spy = sandbox.spy(websocket, 'send');
				var expectedPassword = 'someMaskedAndEncodedValue';
				var expectedData = {
					command: 'authentication',
					username: username,
					password: expectedPassword
				};
				var data = JSON.stringify({command: 'handshake', mask: ''});

				Cypher.addResponse(expectedPassword);
				Cypher.addResponse(expectedPassword);

				websocket.dispatchEvent('message', {data: data});

				spy.should.have.been.calledWith(JSON.stringify(expectedData));
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
					var data = JSON.stringify({command: 'handshake', mask: ''});
					var expectedData = {
						command: 'reconnection',
						username: username,
						token: token
					};

					websocket.dispatchEvent('close', {});
					clock.tick(ConnectionService.DEFAULT_DELAY);

					var reconnectionWebsocket = WebSocket.getInstance();
					var spy = sandbox.spy(reconnectionWebsocket, 'send');

					reconnectionWebsocket.dispatchEvent('message', {data: data});

					spy.should.have.been.calledWith(JSON.stringify(expectedData)).once;
				});

				it('should trigger the reconnected event after reconnecting successfully', function () {
					var spy = sandbox.spy();
					data = JSON.stringify({command: 'reconnection', valid: true});

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
					data = JSON.stringify({command: 'reconnection', valid: false});

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
