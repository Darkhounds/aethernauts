var SocketEvent = require('./../event/socket-event');

var Constructor = function (eventManager, connections) {
	this._eventManager = eventManager;
	this._connections = connections;
	this._initialized = false;

	this._handleGameCycle = this._handleGameCycle.bind(this);
};

Constructor.GAME_CYCLE_INTERVAL = 10;

Constructor.prototype.initialize = function () {
	if(!this._initialized) {
		this._initialized = true;

		setInterval(this._handleGameCycle, Constructor.GAME_CYCLE_INTERVAL * 1000);
	}
};

Constructor.prototype._handleGameCycle = function () {
	this._connections.forEach(function (connection, username) {
		// connection.socket.send(JSON.stringify({command: 'initialize'}));
		// console.log('INITIALIZED', username);
	})
};

module.exports = Constructor;