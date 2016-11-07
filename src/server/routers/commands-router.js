var DataRouter = require('data-router');

var PongRoute = require('./commands/pong-route');
var AuthenticationRoute = require('./commands/authentication-route');
var ReconnectionRoute = require('./commands/reconnection-route');
var UnknownRoute = require('./commands/unknown-route');

var Constructor = function (eventsManager, dataStorage, cypher) {
	this._eventManager = eventsManager;
	this._dataRouter = new DataRouter();
	this._initialized = false;

	this._pongRoute = new PongRoute(eventsManager);
	this._authenticationRoute = new AuthenticationRoute(eventsManager, dataStorage, cypher);
	this._reconnectionRoute = new ReconnectionRoute(eventsManager, dataStorage);
	this._unknownRoute = new UnknownRoute(eventsManager, dataStorage);

	this._pongRoute.execute = this._pongRoute.execute.bind(this._pongRoute);
	this._authenticationRoute.execute = this._authenticationRoute.execute.bind(this._authenticationRoute);
	this._reconnectionRoute.execute = this._reconnectionRoute.execute.bind(this._reconnectionRoute);
	this._unknownRoute.execute = this._unknownRoute.execute.bind(this._unknownRoute);

	this._handleNewMessage = this._handleNewMessage.bind(this);
};

Constructor.prototype.initialize = function () {
	if (!this._initialized) {
		this._initialized = true;

		this._dataRouter.register('command', 'pong', this._pongRoute.execute);
		this._dataRouter.register('command', 'authentication', this._authenticationRoute.execute);
		this._dataRouter.register('command', 'reconnection', this._reconnectionRoute.execute);
		this._dataRouter.register(this._unknownRoute.execute);

		this._eventManager.on('socket.message', this._handleNewMessage);
	}
};

Constructor.prototype._handleNewMessage = function (socket, msg) {
	var data = JSON.parse(msg);

	this._dataRouter.resolve(data, socket);
};

module.exports = Constructor;
