var util = require('util');
var sinon = require('sinon');
var mock = require('mock-require');
var EventEmitter = require('events').EventEmitter;

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setData = function () {};

Constructor.prototype.render = function () {};

Constructor.mockStart = function () {
	mock('./../../../../../src/client/js/view/authentication/login-view', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../../src/client/js/view/authentication/login-view');
	Constructor.restore();
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.restore = function () {
	Constructor.reset();
};

module.exports = Constructor;
