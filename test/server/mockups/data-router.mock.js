var util = require('util')
var EventEmitter = require('events').EventEmitter;
var mock = require('mock-require');

var _instance = null;

var Constructor = function () {
	_instance = this;
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.register = function () {};
Constructor.prototype.resolve = function () {};

Constructor.mockStart = function () {
	mock('data-router', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('data-router');
};

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
