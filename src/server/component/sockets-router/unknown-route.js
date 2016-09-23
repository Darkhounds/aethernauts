var when = require('when');

function Constructor (data) {
	return when.resolve().then(function () {
		var socket = data._socket;

		var message = JSON.stringify({ command: 'error', code:'unknownCommand', message: data.command });

		socket.send(message);
	});
}

module.exports = Constructor;