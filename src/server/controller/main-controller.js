var when = require('when');

var EventManager = require('./../service/event-manager');

var WaterlineConfig = require('./../object/waterline-config');
var ServerConfig = require('./../object/server-config');
var Cypher = require('./../service/cypher');
var DataStorage = require('./../service/data-storage');
var UsersModel = require('./../model/users-model');
var Sessions = require('./../service/sessions');

var HTTPRequestRouter = require('./../route/http-request-router');
var CommandsRouter = require('./../route/commands-router');

var ConnectionsController = require('./connections-controller');

var Constructor = function (port, root) {
	this._waterlineConfig = new WaterlineConfig(root + '/data/');
	this._serverConfig = new ServerConfig(root, port);

	this._sessions = new Sessions();
	this._eventManager = new EventManager();

	this._createCypher();
	this._setupDataStorage();
	this._setupHTTPRequestRouter();
	this._setupCommandsRouter();

	this._connectionsController = new ConnectionsController(this._eventManager, this._sessions, this._cypher);
	this._connectionsController.initialize();
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
