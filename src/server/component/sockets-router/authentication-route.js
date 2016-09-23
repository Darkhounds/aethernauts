function Constructor (model, data) {
	return model.findOne({ username: data.username, password: data.password })
		.then(_checkUserIsValid)
		.then(_updateUserToken.bind(this, model))
		.then(_sendSuccess.bind(this, data._socket))
		.catch(_sendFailure.bind(this, data._socket));
}

function _checkUserIsValid(user) {
	if (user) return user;
	else throw('AuthenticationFailed');
}

function _updateUserToken(model, user) {
	return model.update({username: user.username}, {token: 'bogus'});
}

function _sendSuccess(socket, users) {
	var user = users[0];
	var message = JSON.stringify({ command: 'authentication', valid: true, token: user.token });

	socket.user = { username: user.username };
	socket.send(message);
}

function _sendFailure(socket) {
	var message = JSON.stringify({ command: 'authentication', valid: false });

	socket.send(message);
}

module.exports = Constructor;