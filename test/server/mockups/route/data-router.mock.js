var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.setup = function () {};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/route/data-router', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/route/data-router');
	Constructor.reset();
};

module.exports = Constructor;
