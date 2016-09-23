var LoginView = require('./../view/login-view');

function Constructor () {
	this._data = null;

	this._loginView = new LoginView();
	this._loginView.setData(this._data);
}

Constructor.prototype.setContext = function (context) {
	this._loginView.render(context);
};

module.exports = Constructor;
