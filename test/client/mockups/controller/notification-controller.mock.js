var sinon = require('sinon');
var mock = require('mock-require');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.setup = function () {};

Constructor.prototype.setContext = function () {};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/controller/notification-controller', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/controller/notification-controller');
	Constructor.restore();
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.restore = function () {
	Constructor.reset();
};

module.exports = Constructor;
