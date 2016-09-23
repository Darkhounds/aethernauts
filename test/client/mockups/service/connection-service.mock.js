var util = require('util');

var EventEmitter = require('events').EventEmitter;

var mock = require('mock-require');

var _instance = null;

var Constructor = function () {
	_instance = this;
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setup = function (url) {
	this._url = url;
};
Constructor.prototype.open = function () {};
Constructor.prototype.close = function () {};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/service/connection-service', new Constructor());
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/service/connection-service');
};

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
