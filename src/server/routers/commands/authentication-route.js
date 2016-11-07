var SocketEvent = require('./../../events/socket-event');

var Constructor = function (eventManager, dataStorage, cypher) {
	this._cypher = cypher;
	this._eventManager = eventManager;
	this._dataStorage = dataStorage;
	this._usersModel = this._dataStorage.getModel('users');
};

Constructor.prototype.execute = function (data) {
	var decoded = this._cypher.decode(data.message.password);
	var unmasked = this._cypher.unmask(decoded, data.socket.mask);
	var password = this._cypher.encrypt(unmasked);

	return this._usersModel.findOne({ username: data.message.username.toLowerCase(), password: password })
		.then(this._checkUserIsValid.bind(this))
		.then(this._updateUserToken.bind(this))
		.then(this._sendSuccess.bind(this, data.socket))
		.catch(this._sendFailure.bind(this, data.socket));
};


Constructor.prototype._checkUserIsValid = function (user) {
	if (user) return user;
	else throw('AuthenticationFailed');
};

Constructor.prototype._updateUserToken = function (user) {
	return this._usersModel.update({username: user.username}, {token: this._cypher.generateMask()});
};

Constructor.prototype._sendSuccess = function (socket, users) {
	var user = users[0];
	var message = JSON.stringify({ command: 'authentication', valid: true, token: user.token });

	socket.username = user.username;
	socket.send(message);

	this._eventManager.emit(SocketEvent.AUTHENTICATED, socket, user);
};

Constructor.prototype._sendFailure = function (socket) {
	var message = JSON.stringify({ command: 'authentication', valid: false });

	socket.send(message);
};

module.exports = Constructor;