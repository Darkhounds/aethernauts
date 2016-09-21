var mock = require('mock-require');
var util = require('util');
var StaticsServerConfig = require('./../../../../src/server/object/statics-server-config');

var _instance = null;

function Constructor (root, port) {
	_instance = new StaticsServerConfig(root, port);

	return _instance;
}
util.inherits(Constructor, StaticsServerConfig);

Constructor.mockStart = function () {
	mock('./../../../../src/server/object/statics-server-config', Constructor);
};
Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/object/statics-server-config');
};
Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;