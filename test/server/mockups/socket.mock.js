var util = require('util')
var EventEmitter = require('events').EventEmitter;
var mock = require('mock-require');

var _instance = null;

function Constructor() {
	_instance = this;
}
util.inherits(Constructor, EventEmitter);

Constructor.prototype.send = function () {};

Constructor.mockStart = function () {
	mock('socket', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('socket');
};

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
