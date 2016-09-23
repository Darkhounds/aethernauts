var mock = require('mock-require');

var _instance;
var Constructor = function () {
	_instance = this;
};

Constructor.prototype.addAuthentication = function () {};
Constructor.prototype.addReconnection = function () {};
Constructor.prototype.addUnknownCommand = function () {};
Constructor.prototype.registerSocket = function () {};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../../src/server/component/sockets-router/sockets-router', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../../src/server/component/sockets-router/sockets-router');
};

module.exports = Constructor;