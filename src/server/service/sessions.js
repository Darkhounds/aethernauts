var Constructor = function () {
	this._sessions = {};
};

Constructor.prototype.add = function (socket) {
	this._sessions[socket.user.username] = {
		socket: socket,
		checked: true
	};
};

Constructor.prototype.get = function (username) {
	return this._sessions[username];
};

Constructor.prototype.remove = function (socket) {
	if (socket.user) {
		delete this._sessions[socket.user.username];
	}
};

Constructor.prototype.forEach = function (iterator) {
	for (var username in this._sessions) {
		iterator(this._sessions[username], username, this._sessions);
	}
};

module.exports = Constructor;