var SocketEvent = require('./../../event/socket-event');

var Constructor = function (eventManager, dataStorage, cypher) {
	this._cypher = cypher;
	this._eventManager = eventManager;
	this._dataStorage = dataStorage;
	this._usersModel = this._dataStorage.getModel('users');
};

Constructor.prototype.execute = function (data) {
	var decoded = this._cypher.decode(data.password);
	var unmasked = this._cypher.unmask(decoded, data._socket.mask);
	var password = this._cypher.encrypt(unmasked);

	return this._usersModel.findOne({ username: data.username.toLowerCase(), password: password })
		.then(this._checkUserIsValid.bind(this))
		.then(this._updateUserToken.bind(this))
		.then(this._sendSuccess.bind(this, data._socket))
		.catch(this._sendFailure.bind(this, data._socket));
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

	socket.user = { username: user.username };

	socket.send(message);

	this._eventManager.emit(SocketEvent.AUTHENTICATED, socket);
};

Constructor.prototype._sendFailure = function (socket, error) {
	var message = JSON.stringify({ command: 'authentication', valid: false });

	socket.send(message);
};

module.exports = Constructor;