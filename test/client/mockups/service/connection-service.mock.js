var util = require('util');
var sinon = require('sinon');
var mock = require('mock-require');
var EventEmitter = require('events').EventEmitter;

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setup = function () {};

Constructor.prototype.open = function () {};

Constructor.prototype.close = function () {};

Constructor.prototype.register = function () {};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/service/connection-service', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/service/connection-service');
	Constructor.restore();
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.restore = function () {
	Constructor.reset();
};

module.exports = Constructor;
