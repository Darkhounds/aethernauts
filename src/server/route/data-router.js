var DataRouter = require('data-router');

var AuthenticationRoute = require('./data/authentication-route');
var ReconnectionRoute = require('./data/reconnection-route');
var UnknownRoute = require('./data/unknown-route');

var Constructor = function (eventsManager, dataStorage) {
	this._authenticationRoute = new AuthenticationRoute(eventsManager, dataStorage);
	this._reconnectionRoute = new ReconnectionRoute(eventsManager, dataStorage);
	this._unknownRoute = new UnknownRoute(eventsManager, dataStorage);

	this._dataRouter = new DataRouter();
	this._dataRouter.register('command', 'authentication', this._authenticationRoute.execute.bind(this._authenticationRoute));
	this._dataRouter.register('command', 'reconnection', this._reconnectionRoute.execute.bind(this._reconnectionRoute));
	this._dataRouter.register(this._unknownRoute.execute.bind(this._unknownRoute));

	this._eventManager = eventsManager;
	this._eventManager.on('socket.opened', this._handleConnectionOpened.bind(this));
	this._eventManager.on('socket.message', this._handleNewMessage.bind(this));
	this._eventManager.on('socket.closed', this._handleConnectionClosed.bind(this));
};
Constructor.CONNECTION_OPENED = 'WEBSOCKET CONNECTION OPENED:';
Constructor.MESSAGE_RECEIVED = 'WEBSOCKET MESSAGE RECEIVED:';
Constructor.CONNECTION_CLOSED = 'WEBSOCKET CONNECTION CLOSED:';

Constructor.prototype._handleConnectionOpened = function (socket) {
	console.log(Constructor.CONNECTION_OPENED, socket.upgradeReq.connection.remoteAddress);
};

Constructor.prototype._handleNewMessage = function (socket, msg) {
	console.log(Constructor.MESSAGE_RECEIVED, socket.upgradeReq.connection.remoteAddress, msg);

	var data = JSON.parse(msg);
	data._socket = socket;
	this._dataRouter.resolve(data);
};

Constructor.prototype._handleConnectionClosed = function (socket) {
	console.log(Constructor.CONNECTION_CLOSED, socket.upgradeReq.connection.remoteAddress);
};

module.exports = Constructor;
