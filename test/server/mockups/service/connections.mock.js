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
	for (var id in _connections) {
		iterator(_connections[id], id, _connections);
	}
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/service/connections', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/service/connections');
	Constructor.restore();
};

var _responses = [];
Constructor.addResponse = function (response) {
	_responses.push(response);
};

var _connections = {};
Constructor.addConnection = function (id, connection) {
	_connections[id] = connection;
};

Constructor.restore = function () {
	_responses.length = 0;
	_connections = {};
	Constructor.reset();
};

module.exports = Constructor;
