var mock = require('mock-require');

var _instance = null;

var Constructor = function () {
	_instance = this;
};
Constructor.prototype.render = function () {};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/view/main-view', Constructor);
};
Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/view/main-view');
};
Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
