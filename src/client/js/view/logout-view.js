var util = require('util');
var EventEmitter = require('events').EventEmitter;

var loginTemplate = require('./../../html/authentication/logout.html');
var AuthenticationEvent = require('./../event/authentication-event');

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
	this._updateLogout(context)
};

Constructor.prototype._updateContext = function (context) {
	context.classList.add('logout');
};

Constructor.prototype._updateLogout = function (context) {
	this._context = context;
	this._context.innerHTML = loginTemplate;

	this._handleLogoutClicked = Constructor.prototype._handleLogoutClicked.bind(this);
	this._context.querySelector('#LOGOUT[type="button"]').addEventListener('click', this._handleLogoutClicked);
};

Constructor.prototype._handleLogoutClicked = function () {
	this.emit(AuthenticationEvent.LOGOUT);
};

module.exports = Constructor;
