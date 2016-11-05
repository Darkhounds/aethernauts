var util = require('util');
var EventEmitter = require('events').EventEmitter;

var ConnectionEvent = require('./../event/connection-event');
var Cypher = require('./../util/cypher');

var Constructor = function () {
	this._registerRequest = null;
	this._url = '';
	this._username = '';
	this._password = '';
	this._token = '';
	this._websocket = null;
	this._connected = false;
	this._reconnectionTimeout = -1;
	this._cypher = new Cypher();
	this._timeoutInterval = -1;

	this._handleRegisterRequest = this._handleRegisterRequest.bind(this);
	this._handleRegisterRequestError = this._handleRegisterRequestError.bind(this);
	this._handleConnectionError = this._handleConnectionError.bind(this);
	this._handleMessageReceived = this._handleMessageReceived.bind(this);
	this._handleReconnection = this._handleReconnection.bind(this);
	this._handleClosed = this._handleClosed.bind(this);
	this._handleTimeout = this._handleTimeout.bind(this);
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype._handleRegisterRequest = function () {
	var data = JSON.parse(this._registerRequest.responseText);
	this._registerRequest = null;

	if (data.command === 'registration' && data.valid) {
		this.open(this._username, this._password);
	} else {
		this.emit(ConnectionEvent.REGISTRATION_ERROR, data.errors);
	}
};

Constructor.prototype._handleRegisterRequestError = function () {
	this._registerRequest = null;

	this.emit(ConnectionEvent.CONNECTION_ERROR, ConnectionEvent.CONNECTION_ERROR)
};

Constructor.prototype._handleConnectionError = function () {
	if (this._token) {
		this._reconnect();
	} else {
		this.emit(ConnectionEvent.CONNECTION_ERROR, ConnectionEvent.CONNECTION_ERROR);
		this.close();
	}
};

Constructor.prototype._reconnect = function () {
	this._reconnectionTimeout = setTimeout(this._handleReconnection, Constructor.DEFAULT_DELAY);
	this._destroyConnection();

	this.emit(ConnectionEvent.DISCONNECTED);
};

Constructor.prototype._destroyConnection = function () {
	if (this._websocket) {
		this._websocket.removeEventListener('close', this._handleClosed);
		this._websocket.removeEventListener('message', this._handleMessageReceived);
		this._websocket.removeEventListener('error', this._handleConnectionError);
		this._websocket.close();
	}
	this._websocket = null;

	this._connected = false;
};

Constructor.prototype._handleMessageReceived = function (e) {
	var data = JSON.parse(e.data);
	switch(data.command) {
		case 'ping':
			this._connectionChecked = true;
			this._websocket.send(JSON.stringify({command:'pong'}));
			this._handleTimeout();
			break;
		case 'handshake':
			this._resolveHandshake(data);
			break;
		case 'authentication':
			this._resolveAuthentication(data);
			break;
		case 'reconnection':
			this._resolveReconnected(data);
			break;
		case 'message':
			this._resolveMessage(data);
			break;
		default:
			this.emit(ConnectionEvent.MESSAGE_ERROR);
			break;
	}
};

Constructor.prototype._resolveHandshake = function (data) {
	this._timeout = data.timeout * 1000 * 2;
	this._cypher.setMask(data.mask);

	if (this._token) {
		this._websocket.send(JSON.stringify({command:'reconnection', username: this._username, token: this._token}));
	} else {
		var password = this._cypher.encode(this._cypher.mask(this._password));
		this._websocket.send(JSON.stringify({command:'authentication', username: this._username, password: password}))
	}
};

Constructor.prototype._resolveAuthentication = function (data) {
	this._password = null;

	if (data.valid) {
		this._connectionChecked = true;
		this._connected = true;
		this._token = data.token;
		this.emit(ConnectionEvent.OPENED, this._username, this._token);
		this._handleTimeout();
	} else {
		this.emit(ConnectionEvent.AUTHENTICATION_ERROR, ConnectionEvent.AUTHENTICATION_ERROR);
		this.close();
	}
};

Constructor.prototype._resolveReconnected = function (data) {
	if (data.valid) {
		this._connectionChecked = true;
		this.emit(ConnectionEvent.RECONNECTED);
		this._handleTimeout();
	} else {
		this.emit(ConnectionEvent.AUTHENTICATION_ERROR);
		this.close();
	}
};

Constructor.prototype._resolveMessage = function (data) {
	this.emit(ConnectionEvent.MESSAGE, data.id, data.data);
};

Constructor.prototype._handleReconnection = function () {
	this.open(this._username);
};

Constructor.prototype._handleClosed = function () {
	if (this._token) {
		this._reconnect();
	} else {
		this.emit(ConnectionEvent.CONNECTION_ERROR);
		this.close();
	}
};

Constructor.prototype._handleTimeout = function () {
	clearTimeout(this._timeoutInterval);

	if (this._connectionChecked) {
		this._timeoutInterval = setTimeout(this._handleTimeout, this._timeout);
	} else {
		this._handleClosed();
	}

	this._connectionChecked = false;
};

Constructor.prototype.register = function (email, username, password, character) {
	if (!this._registerRequest) {
		var params = 'email=' + email + '&username=' + username + '&password=' + password + '&character=' + character;
		this._username = username;

		this._password = password;
		this._registerRequest = new XMLHttpRequest();
		this._registerRequest.open('POST', '/register', true);
		this._registerRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		this._registerRequest.addEventListener('load', this._handleRegisterRequest);
		this._registerRequest.addEventListener('error', this._handleRegisterRequestError);
		this._registerRequest.send(params);
	}
};

Constructor.prototype.setup = function (url) {
	this._url = url;
};

Constructor.prototype.open = function (username, password, token) {
	if (!this._websocket) {
		this._username = username;
		this._password = password;
		this._token = token || this._token;
		this._connected = false;
		this._createConnection(password);
	}
};

Constructor.prototype._createConnection = function () {
	clearTimeout(this._reconnectionTimeout);

	this._websocket = new WebSocket(this._url);

	this._websocket.addEventListener('error', this._handleConnectionError);
	this._websocket.addEventListener('message', this._handleMessageReceived);
	this._websocket.addEventListener('close', this._handleClosed);
};

Constructor.prototype.send = function (data, id) {
	var result = false;

	if (this._connected) {
		var package = {
			command: 'message',
			id: id || '',
			data: data
		};
		this._websocket.send(JSON.stringify(package));
		result = true;
	}
	return result;

};

Constructor.prototype.close = function () {
	clearTimeout(this._timeoutInterval);
	this._destroyConnection();
	this._username = '';
	this._token = '';
	this.emit(ConnectionEvent.CLOSED);

};

Constructor.DEFAULT_DELAY = 3 * 1000;

module.exports = Constructor;
