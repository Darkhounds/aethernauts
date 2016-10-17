var util = require('util');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});
util.inherits(Constructor, EventEmitter);

Constructor.prototype.send = function () {};
Constructor.prototype.open = function () {};
Constructor.prototype.setRequestHeader = function () {};

Constructor.prototype.addEventListener = Constructor.prototype.on;
Constructor.prototype.removeEventListener = Constructor.prototype.removeListener;
Constructor.prototype.dispatchEvent = Constructor.prototype.emit;

Constructor.UNSENT = 0;
Constructor.OPENED = 1;
Constructor.HEADERS_RECEIVED = 2;
Constructor.LOADING = 3;
Constructor.DONE = 4;

Constructor.mockStart = function () {
	_httpRequest = global.XMLHttpRequest;
	global.XMLHttpRequest = Constructor;
	window.XMLHttpRequest = Constructor;
};

var _httpRequest;
Constructor.mockStop = function () {
	global.XMLHttpRequest = _httpRequest;
	window.XMLHttpRequest = _httpRequest;
	Constructor.reset();
};

Constructor.getInstance = function () {
	return _instance;
};

module.exports = Constructor;
