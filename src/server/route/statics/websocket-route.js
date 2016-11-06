var util = require('util');
var AbstractRoute = require('./abstract-route');
var SocketEvent = require('./../../event/socket-event');

var Constructor = function (eventManager) {
	this._eventManager = eventManager;
};
util.inherits(Constructor, AbstractRoute);

Constructor.prototype.execute = function (socket) {
	this._eventManager.emit(SocketEvent.OPENED, socket);

	socket._handleMessage = this._handleMessage.bind(this, socket);
	socket.on('message', socket._handleMessage);

	socket._handleClosed = this._handleClosed.bind(this, socket);
	socket.on('close', socket._handleClosed);
};

Constructor.prototype._handleMessage = function (socket, msg) {
	this._eventManager.emit(SocketEvent.MESSAGE, socket, msg)
};

Constructor.prototype._handleClosed = function (socket) {
	socket.removeListener('message', socket._handleMessage);
	socket._handleMessage = null;

	socket.removeListener('close', socket._handleClosed);
	socket._handleClosed = null;

	this._eventManager.emit(SocketEvent.CLOSED, socket);
};

module.exports = Constructor;