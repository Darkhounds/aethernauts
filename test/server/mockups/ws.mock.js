var mock = require('mock-require');

var _instance;

var Constructor = function () {
	_instance = this;
};

Constructor.prototype.Server = require('./ws-server.mock');

Constructor.mockStart = function () { mock('ws', new Constructor()); };

Constructor.mockStop = function () { mock.stop('ws'); };

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
