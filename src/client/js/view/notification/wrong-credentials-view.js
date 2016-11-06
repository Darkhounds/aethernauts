var util = require('util');
var EventEmitter = require('events').EventEmitter;

var wrongCredentialsTemplate = require('./../../../html/notification/wrong-credentials.html');
var NotificationEvent = require('./../../event/notification-event');

var Constructor = function () {
	this._handleClose = this._handleClose.bind(this);
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype.render = function (context) {
	this._context = context;

	context.innerHTML = wrongCredentialsTemplate;
	context.classList.remove('hidden');

	this._context.querySelector('.wrong-credentials').addEventListener('click', this._handleClose);
};

Constructor.prototype._handleClose = function () {
	this.emit(NotificationEvent.CLOSE);
};

module.exports = Constructor;