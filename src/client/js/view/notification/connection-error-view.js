var util = require('util');
var EventEmitter = require('events').EventEmitter;

var connectionErrorTemplate = require('./../../../html/notification/connection-error.html');
var NotificationEvent = require('./../../event/notification-event');

var Constructor = function () {
	this._handleClose = this._handleClose.bind(this);
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype._handleClose = function () {
	this.emit(NotificationEvent.CLOSE);
};

Constructor.prototype.render = function (context) {
	this._context = context;

	context.innerHTML = connectionErrorTemplate;
	context.classList.remove('hidden');

	this._context.querySelector('.connection-error').addEventListener('click', this._handleClose);
};

module.exports = Constructor;