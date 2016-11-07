var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;

	this.foo = 'bar'
});

Constructor.prototype.add = function () {};
Constructor.prototype.get = function () {
	return _responses.shift();
};
Constructor.prototype.remove = function () {};
Constructor.prototype.forEach = function (iterator) {
	for (var id in _sessions) {
		iterator(_sessions[id], id, _sessions);
	}
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/services/sessions', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/services/sessions');
	Constructor.restore();
};

var _responses = [];
Constructor.addResponse = function (response) {
	_responses.push(response);
};

var _sessions = {};
Constructor.addSession = function (id, connection) {
	_sessions[id] = connection;
};

Constructor.restore = function () {
	_responses.length = 0;
	_sessions = {};
	Constructor.reset();
};

module.exports = Constructor;
