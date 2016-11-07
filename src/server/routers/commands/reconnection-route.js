var SocketEvent = require('./../../events/socket-event');

var Constructor = function (eventManager, dataStorage) {
	this._eventManager = eventManager;
	this._dataStorage = dataStorage;
	this._usersModel = this._dataStorage.getModel('users');
};

Constructor.prototype.execute = function (data) {
	return this._usersModel.findOne({ username: data.message.username, token: data.message.token })
		.then(this._checkUserIsValid.bind(this))
		.then(this._sendSuccess.bind(this, data.socket))
		.catch(this._sendFailure.bind(this, data.socket));
};

Constructor.prototype._checkUserIsValid = function (user) {
	if (user) return user;
	else throw('ReconnectionFailed');
};

Constructor.prototype._sendSuccess = function (socket, user) {
	var message = JSON.stringify({ command: 'reconnection', valid: true });

	socket.send(message);

	this._eventManager.emit(SocketEvent.AUTHENTICATED, socket, user);
};

Constructor.prototype._sendFailure = function (socket) {
	var message = JSON.stringify({ command: 'reconnection', valid: false });

	socket.send(message);
};

module.exports = Constructor;