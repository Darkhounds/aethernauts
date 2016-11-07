var when = require('when');

var Constructor = function (eventManager, dataStorage) {
	this._eventManager = eventManager;
	this._dataStorage = dataStorage;
};

Constructor.prototype.execute = function (data) {
	return when.resolve().then(function () {
		var message = JSON.stringify({ command: 'error', code:'unknownCommand', message: data.message.command });

		data.socket.send(message);
	});
};

module.exports = Constructor;