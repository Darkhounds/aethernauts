var mock = require('mock-require');

var _instance = null;

function Constructor () {
	_instance = this;
}

Constructor.prototype.addLogger = function () {};
Constructor.prototype.addStaticAssets = function () {};
Constructor.prototype.addStaticFavicon = function () {};
Constructor.prototype.addStaticIndex = function () {};

Constructor.mockStart = function () {
	mock('./../../../../../src/server/component/router/statics-router', Constructor);
};
Constructor.mockStop = function () {
	mock.stop('./../../../../../src/server/component/router/statics-router');
};
Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;