var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.execute = function () {};
Constructor.prototype.setup = function () {};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../../src/server/routers/statics/static-index-route', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../../src/server/routers/statics/static-index-route');
	Constructor.restore();
};

Constructor.restore = function () {
	Constructor.reset();
};

module.exports = Constructor;
