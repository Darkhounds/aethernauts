var LoginView = require('./../view/login-view');
var LogoutView = require('./../view/logout-view');
var connectionEvents = require('./../event/connection-events');

function Constructor () {
	this._context = null;
	this._data = null;

	this._connectionService = require('./../service/connection-service');
	this._addConnectionServiceEvents();

	this._loginView = new LoginView();
	this._setupLoginView();

	this._logoutView = new LogoutView();
	this._setupLogoutView();
}

Constructor.prototype._addConnectionServiceEvents = function () {
	this._handleConnectionError = Constructor.prototype._handleConnectionError.bind(this);
	this._connectionService.on(connectionEvents.CONNECTION_ERROR, this._handleConnectionError);
	this._connectionService.on(connectionEvents.AUTHENTICATION_ERROR, this._handleConnectionError);

	this._handleConnectionOpened = Constructor.prototype._handleConnectionOpened.bind(this);
	this._connectionService.on(connectionEvents.OPENED, this._handleConnectionOpened);

	this._handleConnectionDisconnected = Constructor.prototype._handleConnectionDisconnected.bind(this);
	this._connectionService.on(connectionEvents.DISCONNECTED, this._handleConnectionDisconnected);

	this._handleConnectionReconnected = Constructor.prototype._handleConnectionReconnected.bind(this);
	this._connectionService.on(connectionEvents.RECONNECTED, this._handleConnectionReconnected);

	this._handleConnectionClosed = Constructor.prototype._handleConnectionClosed.bind(this);
	this._connectionService.on(connectionEvents.CLOSED, this._handleConnectionClosed);
};

Constructor.prototype._handleConnectionError = function (e) {
	console.error(e);
};

Constructor.prototype._handleConnectionOpened = function () {
	this._logoutView.render(this._context);
};

Constructor.prototype._handleConnectionDisconnected = function () {
	this._context.classList.add('disconnected');
};

Constructor.prototype._handleConnectionReconnected = function () {
	this._context.classList.remove('disconnected');
};

Constructor.prototype._handleConnectionClosed = function () {
	this._loginView.setData(this._data);
	this._loginView.render(this._context);
};

Constructor.prototype._setupLoginView = function () {
	this._handleAuthenticate = Constructor.prototype._handleAuthenticate.bind(this);
	this._loginView.on('authenticate', this._handleAuthenticate);
};

Constructor.prototype._handleAuthenticate = function (username, password) {
	this._connectionService.open(username, password);
};

Constructor.prototype._setupLogoutView = function () {
	this._handleDisconnect = Constructor.prototype._handleDisconnect.bind(this);
	this._logoutView.on('disconnect', this._handleDisconnect);
};

Constructor.prototype._handleDisconnect = function () {
	this._connectionService.close();
};

Constructor.prototype.setContext = function (context) {
	this._context = context;
	this._loginView.setData(this._data);
	this._loginView.render(context);
};

module.exports = Constructor;
