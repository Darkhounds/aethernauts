var util = require('util');
var EventEmitter = require('events').EventEmitter;

var registrationErrorTemplate = require('./../../../html/notification/registration-error.html');
var NotificationEvent = require('./../../event/notification-event');

var Constructor = function () {
	this._handleClose = this._handleClose.bind(this);
};
util.inherits(Constructor, EventEmitter);

Constructor.prototype._handleClose = function () {
	this.emit(NotificationEvent.CLOSE);
};
//{"command":"registration","valid":false,"errors":["email","username","character"]}

Constructor.prototype.render = function (context, errors) {
	this._context = context;

	var reasons = '';
	errors.forEach(function (error) {
		reasons += "<p>Invalid " + error + "</p>";
	});

	context.innerHTML = registrationErrorTemplate.replace(/{{REASONS}}/ig, reasons);
	context.classList.remove('hidden');

	this._context.querySelector('.registration-error').addEventListener('click', this._handleClose);
};

module.exports = Constructor;