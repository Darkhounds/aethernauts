var when = require('when');

var EventManager = require('./../services/event-manager');

var WaterlineConfig = require('./../objects/waterline-config');
var ServerConfig = require('./../objects/server-config');
var Cypher = require('./../services/cypher');
var DataStorage = require('./../services/data-storage');
var UsersModel = require('./../models/users-model');
var Sessions = require('./../services/sessions');

var HTTPRequestRouter = require('./../routers/http-request-router');
var CommandsRouter = require('./../routers/commands-router');

var SessionsController = require('./sessions-controller');

var Constructor = function (port, root) {
	this._waterlineConfig = new WaterlineConfig(root + '/data/');
	this._serverConfig = new ServerConfig(root, port);

	this._sessions = new Sessions();
	this._eventManager = new EventManager();

	this._createCypher();
	this._setupDataStorage();
	this._setupHTTPRequestRouter();
	this._setupCommandsRouter();

	this._sessionsController = new SessionsController(this._eventManager, this._sessions, this._cypher);
	this._sessionsController.initialize();
};

Constructor.prototype._createCypher = function ()  {
	this._cypher = new Cypher();
	this._cypher.setup(this._serverConfig);

	if (this._serverConfig.defaultUsers) {
		this._serverConfig.defaultUsers.forEach(this._encryptDefaultUserPassword.bind(this));
	}
};

Constructor.prototype._encryptDefaultUserPassword = function (defaultUser) {
	defaultUser.password = this._cypher.encrypt(defaultUser.password);
};

Constructor.prototype._setupDataStorage = function () {
	this._dataStorage = new DataStorage();
	this._dataStorage.setup(this._waterlineConfig);

	var userModel = new UsersModel(this._serverConfig.defaultUsers);
	this._dataStorage.addModel('users', userModel);
};

Constructor.prototype._setupHTTPRequestRouter = function () {
	this._httpRequestRouter = new HTTPRequestRouter(this._eventManager, this._dataStorage, this._cypher);
	this._httpRequestRouter.setup(this._serverConfig);
};

Constructor.prototype._setupCommandsRouter = function () {
	this._commandsRouter = new CommandsRouter(this._eventManager, this._dataStorage, this._cypher);
	this._commandsRouter.initialize();
};

Constructor.prototype.connect = function () {
	return this._dataStorage.initialize()
		.then(this._httpRequestRouter.initialize.bind(this._httpRequestRouter))
		.catch(function (error) {
			console.log(error.message +'\n\n'+ error.stack);
			throw(error);
		});
};

module.exports = Constructor;
