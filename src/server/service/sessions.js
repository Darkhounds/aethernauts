var Constructor = function () {
	this._sessions = {};
};

Constructor.prototype.add = function (socket, user) {
	this._sessions[socket.username] = {
		socket: socket,
		user: user,
		checked: true
	};
};

Constructor.prototype.get = function (username) {
	return this._sessions[username];
};

Constructor.prototype.remove = function (socket) {
	if (socket.username) {
		delete this._sessions[socket.username];
	}
};

Constructor.prototype.forEach = function (iterator) {
	for (var username in this._sessions) {
		iterator(this._sessions[username], username, this._sessions);
	}
};

module.exports = Constructor;