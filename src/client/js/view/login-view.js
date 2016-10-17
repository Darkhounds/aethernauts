var util = require('util');
var EventEmitter = require('events').EventEmitter;

var loginTemplate = require('./../../html/authentication/login.html');
var AuthenticationEvent = require('./../event/authentication-event');

function Constructor () {
	this._data = {};

	this._handleSubmit = Constructor.prototype._handleSubmit.bind(this);
	this._handleResgisterClicked = Constructor.prototype._handleResgisterClicked.bind(this);
}
util.inherits(Constructor, EventEmitter);

Constructor.prototype.setData = function (data) {
	this._data = data || {};
	this._context = null;
};

Constructor.prototype.render = function (context) {
	this._updateContext(context);
	this._updateLogin(context)
};

Constructor.prototype._updateContext = function (context) {
	context.classList.add('login');
};

Constructor.prototype._updateLogin = function (context) {
	this._context = context;
	this._context.innerHTML = loginTemplate;
	this._context.querySelector('#USERNAME input').value = this._data.username || '';
	this._context.querySelector('#PASSWORD input').value = this._data.password || '';

	this._context.querySelector('#AUTHENTICATION').addEventListener('submit', this._handleSubmit);
	this._context.querySelector('#REGISTER').addEventListener('click', this._handleResgisterClicked)
};

Constructor.prototype._handleSubmit = function (e) {
	this._context.querySelector('#AUTHENTICATION').action = 'save-form-history?' + Date.now();
	e.stopImmediatePropagation();
	this._submit();
};

Constructor.prototype._submit = function () {
	var username = this._context.querySelector('#USERNAME input').value;
	var password = this._context.querySelector('#PASSWORD input').value;

	this.emit(AuthenticationEvent.AUTHENTICATE, username, password);
};

Constructor.prototype._handleResgisterClicked = function () {
	this.emit(AuthenticationEvent.REGISTER);
};

module.exports = Constructor;
