var loginTemplate = require('./../../html/authentication/login.html');

function Constructor () {}

Constructor.prototype.setData = function (data) {
	this._data = data;
};

Constructor.prototype.render = function (context) {
	this._updateContext(context);
	this._updateLogin(context)
};

Constructor.prototype._updateContext = function (context) {
	context.classList.add('authentication');
};

Constructor.prototype._updateLogin = function (context) {
	context.innerHTML = loginTemplate;
};

module.exports = Constructor;
