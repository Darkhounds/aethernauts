var util = require('util')
var EventEmitter = require('events').EventEmitter;
var connectionEvents = require('./../event/connection-events');

var Constructor = function () {
	this._url = '';
	this._username = '';
	this._token = '';
	this._websocket = null;
	this._connected = false;
	this._reconnectionTimeout = -1;
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.DEFAULT_DELAY = 3 * 1000;

Constructor.prototype.setup = function (url) {
	this._url = url;
};

Constructor.prototype.open = function (username, password, token) {
	if (!this._websocket) {
		this._username = username;
		this._token = token || this._token;
		this._connected = false;

		this._createConnection(password);
	}
};

Constructor.prototype._createConnection = function (password) {
	clearTimeout(this._reconnectionTimeout);

	this._websocket = new WebSocket(this._url);

	this._handleConnectionError = Constructor.prototype._handleConnectionError.bind(this);
	this._websocket.addEventListener('error', this._handleConnectionError);

	this._handleConnectionOpened = Constructor.prototype._handleConnectionOpened.bind(this, password);
	this._websocket.addEventListener('open', this._handleConnectionOpened);

	this._handleMessageReceived = Constructor.prototype._handleMessageReceived.bind(this);
	this._websocket.addEventListener('message', this._handleMessageReceived);

	this._handleClosed = Constructor.prototype._handleClosed.bind(this);
	this._websocket.addEventListener('close', this._handleClosed);
};

Constructor.prototype._handleConnectionOpened = function (password) {
	if (this._token) {
		this._websocket.send(JSON.stringify({command:'reconnection', username: this._username, token: this._token}));
	} else {
		this._websocket.send(JSON.stringify({command:'authentication', username: this._username, password: password}))
	}
};

Constructor.prototype.close = function () {
	this._destroyConnection();
	this._username = '';
	this._token = '';

	this.emit(connectionEvents.CLOSED);
};

Constructor.prototype._destroyConnection = function () {
	if (this._websocket) {
		this._websocket.removeEventListener('close', this._handleClosed);
		this._websocket.removeEventListener('message', this._handleMessageReceived);
		this._websocket.removeEventListener('open', this._handleConnectionOpened);
		this._websocket.removeEventListener('error', this._handleConnectionError);
		this._websocket.close();
	}

	this._websocket = null;
	this._connected = false;
};

Constructor.prototype._handleConnectionError = function () {
	if (this._token) {
		this._reconnect();
	} else {
		this.emit(connectionEvents.CONNECTION_ERROR);
		this.close();
	}
};

Constructor.prototype._reconnect = function () {
	this._handleReconnection = Constructor.prototype._handleReconnection.bind(this);
	this._reconnectionTimeout = setTimeout(this._handleReconnection, Constructor.DEFAULT_DELAY);

	this._destroyConnection();
	this.emit(connectionEvents.DISCONNECTED);
};

Constructor.prototype._handleMessageReceived = function (e) {
	var data = JSON.parse(e.data);

	switch(data.command) {
		case 'authentication':
			this._handleAuthentication(data);
			break;
		case 'reconnected':
			this._handleReconnected(data);
			break;
		case 'message':
			this._handleMessage(data);
			break;
		default:
			this.emit(connectionEvents.MESSAGE_ERROR);
			break;
	}
};

Constructor.prototype._handleAuthentication = function (data) {
	if (data.valid) {
		this._connected = true;
		this._token = data.token;
		this.emit(connectionEvents.OPENED, this._username, this._token);
	} else {
		this.emit(connectionEvents.AUTHENTICATION_ERROR);
		this.close();
	}
};

Constructor.prototype._handleReconnected = function (data) {
	if (data.valid) {
		this.emit(connectionEvents.RECONNECTED);
	} else {
		this.emit(connectionEvents.AUTHENTICATION_ERROR);
		this.close();
	}
};

Constructor.prototype._handleMessage = function (data) {
	this.emit(connectionEvents.MESSAGE, data.id, data.data);
};

Constructor.prototype._handleClosed = function () {
	if (this._token) {
		this._reconnect();
	} else {
		this.emit(connectionEvents.CONNECTION_ERROR);
		this.close();
	}
};

Constructor.prototype._handleReconnection = function () {
	this.open(this._username);
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

module.exports = new Constructor();
