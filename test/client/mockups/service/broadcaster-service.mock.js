var util = require('util');
var sinon = require('sinon');
var mock = require('mock-require');
var EventEmitter = require('events').EventEmitter;

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});
util.inherits(Constructor, EventEmitter);

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/service/broadcaster-service', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/service/broadcaster-service');
	Constructor.reset();
};

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
