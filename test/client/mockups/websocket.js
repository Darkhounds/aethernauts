var util = require('util');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;

var _instance = null;
var Constructor = sinon.spy(function (url, protocols) {
	_instance = this;

	this.protocol = '';
	if (protocols) {
		this.protocol = (typeof protocols === 'string') ? protocols : protocols[0];
	}

	this.url = url;
	this.readyState = true;
	this.binaryType = 'blob';
});
util.inherits(Constructor, EventEmitter);

Constructor.prototype.send = function () {};
Constructor.prototype.close = function () {};

Constructor.prototype.addEventListener = Constructor.prototype.on;
Constructor.prototype.removeEventListener = Constructor.prototype.removeListener;
Constructor.prototype.dispatchEvent = Constructor.prototype.emit;

Constructor.CONNECTING = 0;
Constructor.OPEN = 1;
Constructor.CLOSING = 2;
Constructor.CLOSED = 3;

Constructor.mockStart = function () {
	_websocket = global.WebSocket;
	global.WebSocket = Constructor;
	window.WebSocket = Constructor;
};

var _websocket;
Constructor.mockStop = function () {
	global.WebSocket = _websocket;
	window.WebSocket = _websocket;
	Constructor.restore();
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.restore = function () {
	Constructor.reset();
};

module.exports = Constructor;
