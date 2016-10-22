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

	appElement.classList.add('app');

	this._authenticationController.setContext(appElement.querySelector('#AUTHENTICATION'));
	this._notificationController.setContext(appElement.querySelector('#NOTIFICATION'));
};

module.exports = Constructor;
