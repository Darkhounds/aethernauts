var NotificationEvent = require('./../event/notification-event');

var EmptyView = require('./../view/notification/empty-view');
var DisconnectedView = require('./../view/notification/disconnected-view');
var WrongCredentialsView = require('./../view/notification/wrong-credentials-view');
var ConnectionErrorView = require('./../view/notification/connection-error-view');
var RegistrationErrorView = require('./../view/notification/registration-error-view');

var Constructor = function () {
	this._context = null;
	this._data = null;
	this._active = null;

	this._handleDisconnectedNotification = this._handleDisconnectedNotification.bind(this);
	this._handleReconnectedNotification = this._handleReconnectedNotification.bind(this);
	this._handleAuthenticationFailedNotification = this._handleAuthenticationFailedNotification.bind(this);
	this._handleWrongCredentialsClose = this._handleWrongCredentialsClose.bind(this);
	this._handleConnectionErrorNotification = this._handleConnectionErrorNotification.bind(this);
	this._handleConnectionErrorClose = this._handleConnectionErrorClose.bind(this);
	this._handleRegistrationErrorNotification = this._handleRegistrationErrorNotification.bind(this);
	this._handleResgistrationErrorClose = this._handleResgistrationErrorClose.bind(this);
};

Constructor.prototype._handleDisconnectedNotification = function () {
	if(this._active !== this._disconnectedView) {
		this._active = this._disconnectedView;
		this._disconnectedView.render(this._context);
	}
};

Constructor.prototype._handleReconnectedNotification = function () {
	if(this._active === this._disconnectedView) {
		this._emptyView.render(this._context);
		this._active = null;
	}
};

Constructor.prototype._handleAuthenticationFailedNotification = function () {
	if(this._active !== this._wrongCredentials) {
		this._active = this._wrongCredentials;
		this._wrongCredentials.render(this._context);
	}
};

Constructor.prototype._handleWrongCredentialsClose = function () {
	if(this._active === this._wrongCredentials) {
		this._active = null;
		this._emptyView.render(this._context);
	}
};

Constructor.prototype._handleConnectionErrorNotification = function () {
	if(this._active !== this._connectionErrorView) {
		this._active = this._connectionErrorView;
		this._connectionErrorView.render(this._context);
	}
};

Constructor.prototype._handleConnectionErrorClose = function () {
	if(this._active === this._connectionErrorView) {
		this._active = null;
		this._emptyView.render(this._context);
	}
};

Constructor.prototype._handleRegistrationErrorNotification = function (errors) {
	if(this._active !== this._registrationErrorView) {
		this._active = this._registrationErrorView;
		this._registrationErrorView.render(this._context, errors);
	}
};

Constructor.prototype._handleResgistrationErrorClose = function () {
	if(this._active === this._registrationErrorView) {
		this._active = null;
		this._emptyView.render(this._context);
	}
};

Constructor.prototype.setup = function (broadcasterService) {
	this._broadcasterService = broadcasterService;
	this._addBroadcasterServiceEvents();

	this._emptyView = new EmptyView();

	this._disconnectedView = new DisconnectedView();

	this._wrongCredentials = new WrongCredentialsView();
	this._wrongCredentials.on(NotificationEvent.CLOSE, this._handleWrongCredentialsClose);

	this._connectionErrorView = new ConnectionErrorView();
	this._connectionErrorView.on(NotificationEvent.CLOSE, this._handleConnectionErrorClose);

	this._registrationErrorView = new RegistrationErrorView();
	this._registrationErrorView.on(NotificationEvent.CLOSE, this._handleResgistrationErrorClose);
};

Constructor.prototype._addBroadcasterServiceEvents = function () {
	this._broadcasterService.on(NotificationEvent.DISCONNECTED, this._handleDisconnectedNotification);
	this._broadcasterService.on(NotificationEvent.RECONNECTED, this._handleReconnectedNotification);
	this._broadcasterService.on(NotificationEvent.AUTHENTICATION_FAILED, this._handleAuthenticationFailedNotification);
	this._broadcasterService.on(NotificationEvent.CONNECTION_FAILED, this._handleConnectionErrorNotification);
	this._broadcasterService.on(NotificationEvent.REGISTRATION_FAILED, this._handleRegistrationErrorNotification);
};

Constructor.prototype.setContext = function (context) {
	this._context = context;
	this._emptyView.render(this._context);
};

module.exports = Constructor;
