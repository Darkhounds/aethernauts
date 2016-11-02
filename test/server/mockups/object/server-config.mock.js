var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;

var Constructor = sinon.spy(function () {
	_instance = this
});

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
