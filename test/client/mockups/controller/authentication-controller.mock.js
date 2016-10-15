var mock = require('mock-require');

var _instance = null;

var Constructor = function () {
	_instance = this;
};

Constructor.prototype.setContext = function () {};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/controller/authentication-controller', Constructor);
};
Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/controller/authentication-controller');
};
Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
