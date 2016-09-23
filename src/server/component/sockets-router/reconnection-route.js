function Constructor (model, data) {
	return model.findOne({ username: data.username, token: data.token })
		.then(_checkUserIsValid)
		.then(_sendSuccess.bind(this, data._socket))
		.catch(_sendFailure.bind(this, data._socket));
}

function _checkUserIsValid(user) {
	if (user) return user;
	else throw('ReconnectionFailed');
}

function _sendSuccess(socket) {
	var message = JSON.stringify({ command: 'reconnection', valid: true });

	socket.send(message);
}

function _sendFailure(socket) {
	var message = JSON.stringify({ command: 'reconnection', valid: false });

	socket.send(message);
}

module.exports = Constructor;