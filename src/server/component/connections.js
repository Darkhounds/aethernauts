var Constructor = function () {
	this._connections = {};
};

Constructor.prototype.add = function (socket) {
	this._connections[socket.user.username] = {
		socket: socket,
		checked: true
	};
};

Constructor.prototype.get = function (username) {
	return this._connections[username];
};

Constructor.prototype.remove = function (socket) {
	if (socket.user) {
		delete this._connections[socket.user.username];
	}
};

Constructor.prototype.forEach = function (iterator) {
	for (var username in this._connections) {
		iterator(this._connections[username], username, this._connections);
	}
};

module.exports = Constructor;