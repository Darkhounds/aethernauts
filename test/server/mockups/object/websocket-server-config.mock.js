var mock = require('mock-require');
var util = require('util');
var WebsocketServerConfig = require('./../../../../src/server/object/websocket-server-config');

var _instance = null;

function Constructor (root, port) {
	_instance = new WebsocketServerConfig(root, port);

	return _instance;
}
util.inherits(Constructor, WebsocketServerConfig);

Constructor.mockStart = function () {
	mock('./../../../../src/server/object/websocket-server-config', Constructor);
};
Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/object/websocket-server-config');
};
Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;