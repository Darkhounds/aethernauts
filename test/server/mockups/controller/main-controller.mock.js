var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.initialize = function () {};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/controller/main-controller', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/controller/main-controller');
	Constructor.reset();
};

module.exports = Constructor;
