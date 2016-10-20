var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mock = require('mock-require');

var _instance = null;

function Constructor() {
	if (!(this instanceof Constructor)) return new Constructor();

	_instance = this;
}
util.inherits(Constructor, EventEmitter);

Constructor.prototype.listen = function (port, callback) {
	callback();
};

Constructor.prototype.use = function () {};

Constructor.prototype.post = function () {};

Constructor.prototype.close = function () {};

Constructor.bodyParser = function () {};

Constructor.mockStart = function () {
	mock('express', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('express');
};

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
