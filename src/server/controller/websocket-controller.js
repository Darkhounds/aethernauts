var Waterline = require('waterline');
var when = require('when');
var WebsocketServerConfig = require('./../object/websocket-server-config');
var waterlineConfig = require('./../object/waterline-config');
var SocketsRouter = require('./../component/sockets-router/sockets-router');
var UsersModel = require('./../model/users-model');

var Constructor = function (port) {
	this._config = new WebsocketServerConfig(port);
	this._socketsRouter = new SocketsRouter();
};

Constructor.MESSAGE_START = '-------- SERVING API --------';

Constructor.prototype.connect = function () {
	return when.promise(this._createServer.bind(this));
};

Constructor.prototype._createServer = function (resolve, reject) {
	if (!this._server) {
		var Server = require('ws').Server;
		this._server = new Server(this._config);

		this._waterline = new Waterline();
		this._usersModel = new UsersModel(this._waterline);
		this._waterline.initialize(waterlineConfig, this._handleDBInitialized.bind(this, resolve));
	} else {
		reject('ServerAlreadyExists');
	}
};

Constructor.prototype._handleDBInitialized = function (resolve) {
	var defaultUser = { username: 'username', password: 'password' };

	this._usersModel.findOrCreate({username: defaultUser.username}, defaultUser)
		.then(this._handleDefaultUserChecked.bind(this))
		.then(resolve);
};

Constructor.prototype._handleDefaultUserChecked = function () {
	this._socketsRouter.addAuthentication(this._usersModel);
	this._socketsRouter.addReconnection(this._usersModel);
	this._socketsRouter.addUnknownCommand();

	this._handleNewSocket = Constructor.prototype._handleNewSocket.bind(this);
	this._server.on('connection', this._handleNewSocket);

	console.log(Constructor.MESSAGE_START);
};

Constructor.prototype._handleNewSocket = function (socket) {
	this._socketsRouter.registerSocket(socket);
};

module.exports = Constructor;
