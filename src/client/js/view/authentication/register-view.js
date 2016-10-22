var util = require('util');
var EventEmitter = require('events').EventEmitter;

var loginTemplate = require('./../../../html/authentication/register.html');
var AuthenticationEvent = require('./../../event/authentication-event');

function Constructor () {
	this._data = {};

	this._handleSubmit = Constructor.prototype._handleSubmit.bind(this);
	this._handleLoginClicked = Constructor.prototype._handleLoginClicked.bind(this);
}
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setData = function (data) {
	this._data = data || {};
	this._context = null;
};

Constructor.prototype.render = function (context) {
	this._updateContext(context);
	this._updateRegister(context)
};

Constructor.prototype._updateContext = function (context) {
	context.classList.add('register');
};

Constructor.prototype._updateRegister = function (context) {
	this._context = context;
	this._context.innerHTML = loginTemplate;
	this._context.querySelector('#EMAIL input').value = this._data.email || '';
	this._context.querySelector('#CONFIRM-EMAIL input').value = this._data.email || '';
	this._context.querySelector('#USERNAME input').value = this._data.username || '';
	this._context.querySelector('#PASSWORD input').value = this._data.password || '';
	this._context.querySelector('#CONFIRM-PASSWORD input').value = this._data.password || '';
	this._context.querySelector('#CHARACTER input').value = this._data.character || '';

	this._context.querySelector('#REGISTRATION').addEventListener('submit', this._handleSubmit);
	this._context.querySelector('#LOGIN').addEventListener('click', this._handleLoginClicked)
};

Constructor.prototype._handleSubmit = function (e) {
	this._context.querySelector('#REGISTRATION').action = 'save-form-history?' + Date.now();
	e.stopImmediatePropagation();
	this._submit();
};

Constructor.prototype._submit = function () {
	this._context.querySelector('#CONFIRM-PASSWORD .error').classList.add('hidden');
	this._context.querySelector('#CONFIRM-EMAIL .error').classList.add('hidden');

	var email = this._context.querySelector('#EMAIL input').value;
	var confirmEmail = this._context.querySelector('#CONFIRM-EMAIL input').value;
	var username = this._context.querySelector('#USERNAME input').value;
	var password = this._context.querySelector('#PASSWORD input').value;
	var confirmPassword = this._context.querySelector('#CONFIRM-PASSWORD input').value;
	var character = this._context.querySelector('#CHARACTER input').value;

	if (email !== confirmEmail) {
		this._context.querySelector('#CONFIRM-EMAIL .error').classList.remove('hidden');
	} else if (password !== confirmPassword) {
		this._context.querySelector('#CONFIRM-PASSWORD .error').classList.remove('hidden');
	} else {
		this.emit(AuthenticationEvent.REGISTER, email, username, password, character);
	}
};

Constructor.prototype._handleLoginClicked = function () {
	this.emit(AuthenticationEvent.AUTHENTICATE);
};

module.exports = Constructor;
