var DataRouter = require('data-router');
var AuthenticationRoute = require('./authentication-route');
var ReconnectionRoute = require('./reconnection-route');
var UnknownRoute = require('./unknown-route');

var Constructor = function () {
	this._dataRouter = new DataRouter();
};

Constructor.prototype.addAuthentication = function (model) {
	this._dataRouter.register('command', 'authentication', AuthenticationRoute.bind(this, model));
};

Constructor.prototype.addReconnection = function (model) {
	this._dataRouter.register('command', 'reconnection', ReconnectionRoute.bind(this, model));
};

Constructor.prototype.addUnknownCommand = function () {
	this._dataRouter.register(UnknownRoute.bind(this));
};

Constructor.prototype.registerSocket = function (socket) {
	socket._handleSocketClosed = Constructor.prototype._handleSocketClosed.bind(this, socket);
	socket.on('close', socket._handleSocketClosed);

	socket._handleSocketMessage = Constructor.prototype._handleSocketMessage.bind(this, socket);
	socket.on('message', socket._handleSocketMessage);
};

Constructor.prototype._handleSocketClosed = function (socket) {
	socket.removeListener('message', socket._handleSocketMessage);
	socket._handleSocketMessage = null;

	socket.removeListener('close', socket._handleSocketClosed);
	socket._handleSocketClosed = null;
};

Constructor.prototype._handleSocketMessage = function (socket, message) {
	var data = JSON.parse(message);
	data._socket = socket;
	this._dataRouter.resolve(data);
};

module.exports = Constructor;