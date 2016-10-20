var AuthenticationController = require('./../controller/authentication-controller');

function Constructor () {
}

Constructor.prototype.setup = function (connectionService) {
	this._authenticationController = new AuthenticationController();
	this._authenticationController.setup(connectionService)
};

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
