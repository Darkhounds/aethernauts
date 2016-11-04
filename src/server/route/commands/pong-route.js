var when = require('when');
var SocketEvent = require('./../../event/socket-event');

var Constructor = function (eventManager) {
	this._eventManager = eventManager;

	this._resolve = this._resolve.bind(this);
};

Constructor.prototype.execute = function (data) {
	return when.resolve().then(this._resolve(data));
};

Constructor.prototype._resolve = function (data) {
	this._eventManager.emit(SocketEvent.PONG, data._socket);
};

module.exports = Constructor;