var util = require('util');
var sinon = require('sinon');
var mock = require('mock-require');
var EventEmitter = require('events').EventEmitter;

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setup = function (url) {
	this._url = url;
};

Constructor.prototype.open = function () {};

Constructor.prototype.close = function () {};

Constructor.prototype.register = function () {};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/service/connection-service', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/service/connection-service');
	Constructor.reset();
};

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
