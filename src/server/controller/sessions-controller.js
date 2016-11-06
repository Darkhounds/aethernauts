var SocketEvent = require('./../event/socket-event');

var Constructor = function (eventManager, sessions, cypher) {
	this._eventManager = eventManager;
	this._sessions = sessions;
	this._cypher = cypher;
	this._intialized = false;

	this._handleSocketOpened = this._handleSocketOpened.bind(this);
	this._handleSocketAuthenticated = this._handleSocketAuthenticated.bind(this);
	this._handleSocketPong = this._handleSocketPong.bind(this);
	this._handleSocketMessage = this._handleSocketMessage.bind(this);
	this._handleSocketClosed = this._handleSocketClosed.bind(this);
	this._handleSocketsCheck = this._handleSocketsCheck.bind(this);
};

Constructor.SOCKET_CHECK_INTERVAL = 10;

Constructor.prototype.initialize = function () {
	if (!this._intialized) {
		this._intialized = true;

		this._eventManager.on(SocketEvent.OPENED, this._handleSocketOpened);
		this._eventManager.on(SocketEvent.AUTHENTICATED, this._handleSocketAuthenticated);
		this._eventManager.on(SocketEvent.PONG, this._handleSocketPong);
		this._eventManager.on(SocketEvent.MESSAGE, this._handleSocketMessage);
		this._eventManager.on(SocketEvent.CLOSED, this._handleSocketClosed);

		setInterval(this._handleSocketsCheck, Constructor.SOCKET_CHECK_INTERVAL * 1000);
	}
};

Constructor.prototype._handleSocketOpened = function (socket) {
	socket.mask = this._cypher.generateMask();
	socket.send(JSON.stringify({command: 'handshake', mask: socket.mask, timeout: Constructor.SOCKET_CHECK_INTERVAL}));
};

Constructor.prototype._handleSocketAuthenticated = function (socket, user) {
	this._sessions.add(socket, user)
};

Constructor.prototype._handleSocketPong = function (socket) {
	var connection = this._sessions.get(socket.username);
	connection.checked = true;
};

Constructor.prototype._handleSocketMessage = function (socket, msg) {
	if (msg != '{"command":"pong"}') {
		console.log('WEBSOCKET MESSAGE RECEIVED:', socket.upgradeReq.connection.remoteAddress, msg);
	}
};

Constructor.prototype._handleSocketClosed = function (socket) {
	console.log('WEBSOCKET CONNECTION CLOSED:', socket.upgradeReq.connection.remoteAddress);

	this._sessions.remove(socket);
};

Constructor.prototype._handleSocketsCheck = function () {
	this._sessions.forEach(function (connection) {
		connection.socket.send(JSON.stringify({command: 'ping'}));

		if (!connection.checked) {
			connection.socket.emit('close', connection.socket);
			connection.socket.close();
		}

		connection.checked = false;
	})
};

module.exports = Constructor;