var when = require('when');
var SocketEvent = require('./../../events/socket-event');

var Constructor = function (eventManager) {
	this._eventManager = eventManager;
};

Constructor.prototype.execute = function (data, socket) {
	return when.resolve().then(this._resolve.bind(this, socket));
};

Constructor.prototype._resolve = function (socket) {
	this._eventManager.emit(SocketEvent.PONG, socket);
};

module.exports = Constructor;