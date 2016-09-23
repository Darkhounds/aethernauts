var util = require('util');
var EventEmitter = require('events').EventEmitter;

var _instance = null;

var Constructor = function (settings) {
	_instance = this;

	this._settings = settings;
};
util.inherits(Constructor, EventEmitter);

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
