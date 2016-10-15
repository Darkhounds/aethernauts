var mock = require('mock-require');
var sinon = require('sinon');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});
util.inherits(Constructor, EventEmitter);

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/component/event-manager', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/component/event-manager');
	Constructor.reset();
};

module.exports = Constructor;
