var AuthenticationController = require('./../controller/authentication-controller');

function Constructor () {
	this._authenticationController = new AuthenticationController();
}

Constructor.prototype.render = function (context) {
	var appElement = context.querySelector('#APP');

	this._updateContext(appElement);
	this._updateAuthenticationController(appElement.querySelector('#AUTHENTICATION'));
};

Constructor.prototype._updateContext = function (context) {
	context.classList.add('app');
};

Constructor.prototype._updateAuthenticationController = function (context) {
	this._authenticationController.setContext(context);
};

module.exports = Constructor;
