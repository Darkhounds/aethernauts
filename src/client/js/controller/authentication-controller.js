var LoginView = require('./../view/authentication/login-view');
var LogoutView = require('./../view/authentication/logout-view');
var RegisterView = require('./../view/authentication/register-view');
var AuthenticationEvent = require('./../event/authentication-event');
var ConnectionEvent = require('./../event/connection-event');

var Constructor = function () {
	this._context = null;
	this._data = null;

	this._handleLogout = Constructor.prototype._handleLogout.bind(this);
	this._handleConnectionError = Constructor.prototype._handleConnectionError.bind(this);
	this._handleConnectionOpened = Constructor.prototype._handleConnectionOpened.bind(this);
	this._handleConnectionDisconnected = Constructor.prototype._handleConnectionDisconnected.bind(this);
	this._handleConnectionReconnected = Constructor.prototype._handleConnectionReconnected.bind(this);
	this._handleConnectionClosed = Constructor.prototype._handleConnectionClosed.bind(this);
	this._handleAuthenticated = Constructor.prototype._handleAuthenticated.bind(this);
	this._handleRegister = Constructor.prototype._handleRegister.bind(this);
	this._handleRegistered = Constructor.prototype._handleRegistered.bind(this);
	this._handleAuthenticate = Constructor.prototype._handleAuthenticate.bind(this);
};

Constructor.prototype.setup = function (connectionService) {
	this._connectionService = connectionService;
	this._addConnectionServiceEvents();

	this._loginView = new LoginView();
	this._setupLoginView();

	this._logoutView = new LogoutView();
	this._setupLogoutView();

	this._registerView = new RegisterView();
	this._setupRegisterView();
};

Constructor.prototype._addConnectionServiceEvents = function () {
	this._connectionService.on(ConnectionEvent.CONNECTION_ERROR, this._handleConnectionError);
	this._connectionService.on(ConnectionEvent.AUTHENTICATION_ERROR, this._handleConnectionError);
	this._connectionService.on(ConnectionEvent.OPENED, this._handleConnectionOpened);
	this._connectionService.on(ConnectionEvent.DISCONNECTED, this._handleConnectionDisconnected);
	this._connectionService.on(ConnectionEvent.RECONNECTED, this._handleConnectionReconnected);
	this._connectionService.on(ConnectionEvent.CLOSED, this._handleConnectionClosed);
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
	this._loginView.on(AuthenticationEvent.AUTHENTICATE, this._handleAuthenticated);
	this._loginView.on(AuthenticationEvent.REGISTER, this._handleRegister);
};

Constructor.prototype._handleAuthenticated = function (username, password) {
	this._connectionService.open(username, password);
};

Constructor.prototype._handleRegister = function () {
	this._registerView.render(this._context);
};

Constructor.prototype._setupLogoutView = function () {
	this._logoutView.on(AuthenticationEvent.LOGOUT, this._handleLogout);
};

Constructor.prototype._handleLogout = function () {
	this._connectionService.close();
};

Constructor.prototype._setupRegisterView = function () {
	this._registerView.on(AuthenticationEvent.REGISTER, this._handleRegistered);
	this._registerView.on(AuthenticationEvent.AUTHENTICATE, this._handleAuthenticate);
};

Constructor.prototype._handleRegistered = function (email, username, password, character) {
	this._connectionService.register(email, username, password, character);
};


Constructor.prototype._handleAuthenticate = function () {
	this._loginView.render(this._context);
};

Constructor.prototype.setContext = function (context) {
	this._context = context;
	this._loginView.setData(this._data);
	this._loginView.render(context);
};

module.exports = Constructor;
