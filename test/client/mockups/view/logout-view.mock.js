var util = require('util');
var mock = require('mock-require');

var EventEmitter = require('events').EventEmitter;

var _instance = null;

var Constructor = function () {
	_instance = this;
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setData = function () {};

Constructor.prototype.render = function () {};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/view/logout-view', Constructor);
};
Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/view/logout-view');
};
Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
