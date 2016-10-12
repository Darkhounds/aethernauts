var mock = require('mock-require');
var sinon = require('sinon');
var util = require('util');

var ServerConfig = require('./../../../../src/server/object/server-config');

var _instance = null;

var Constructor = sinon.spy(function (root, port) {
	_instance = new ServerConfig(root, port);

	return _instance;
});
util.inherits(Constructor, ServerConfig);

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/object/server-config', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/object/server-config');
	Constructor.reset();
};

module.exports = Constructor;
