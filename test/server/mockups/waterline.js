var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mock = require('mock-require');

var _instance, _error, _response;

var Constructor = function () {
	_instance = this;
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.loadCollection = function () {
	return {};
};
Constructor.prototype.initialize = function (config, callback) {
	this.collections = [];
	callback();
};

Constructor.Collection = {
	extend: function () {}
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('waterline', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('waterline', Constructor);
};

Constructor.mockCollection = function (instance, id) {
	instance.collections = {};
	instance.collections[id] = {
		find: Constructor._resolve,
		findOne: Constructor._resolve,
		create: Constructor._resolve,
		findOrCreate: Constructor._resolve,
		update: Constructor._resolve,
		destroy: Constructor._resolve,
		query: Constructor._resolve
	}

	return instance.collections[id];
};

Constructor.setResponse = function (response, error) {
	_response = response;
	_error = error;
};

Constructor._resolve = function () {
	return _error || _response
};

module.exports = Constructor;
