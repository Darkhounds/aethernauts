var AuthenticationController = require('./../controller/authentication-controller');
var NotificationController = require('./../controller/notification-controller');

function Constructor() {}

Constructor.prototype.setup = function (broadcasterService, connectionService) {
	this._authenticationController = new AuthenticationController();
	this._authenticationController.setup(connectionService);

	this._notificationController = new NotificationController();
	this._notificationController.setup(broadcasterService);
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
