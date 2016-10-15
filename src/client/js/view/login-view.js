var util = require('util');
var EventEmitter = require('events').EventEmitter;

var loginTemplate = require('./../../html/authentication/login.html');

function Constructor () {
	this._data = {};
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
	this._context.querySelector('#USERNAME').value = this._data.username || '';
	this._context.querySelector('#PASSWORD').value = this._data.password || '';

	this._handleSubmit = Constructor.prototype._handleSubmit.bind(this);
	this._context.querySelector('#AUTHENTICATION').addEventListener('submit', this._handleSubmit);
};

Constructor.prototype._handleSubmit = function (e) {
	this._context.querySelector('#AUTHENTICATION').action = 'save-form-history?' + Date.now();
	e.stopImmediatePropagation();
	this._submit();
};

Constructor.prototype._submit = function () {
	var username = this._context.querySelector('#USERNAME').value;
	var password = this._context.querySelector('#PASSWORD').value;

	this.emit('authenticate', username, password);
};

module.exports = Constructor;
