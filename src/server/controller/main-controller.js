var when = require('when');

var EventManager = require('./../component/event-manager');

var WaterlineConfig = require('./../object/waterline-config');
var ServerConfig = require('./../object/server-config');
var Cypher = require('./../component/cypher');
var DataStorage = require('./../component/data-storage');
var UsersModel = require('./../model/users-model');

var HTTPRequestRouter = require('./../route/http-request-router');
var DataRouter = require('./../route/data-router');

var Constructor = function () {
	this._eventManager = new EventManager();
};

Constructor.prototype.setup = function (port, root) {
	this._waterlineConfig = new WaterlineConfig(root + '/data/');
	this._serverConfig = new ServerConfig(root, port);

	this._createCypher();
	this._setupDataStorage();
	this._setupHTTPRequestRouter();
	this._setupDataRouter();
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
	this._httpRequestRouter = new HTTPRequestRouter(this._eventManager, this._dataStorage);
	this._httpRequestRouter.setup(this._serverConfig, this._cypher);
};

Constructor.prototype._setupDataRouter = function () {
	this._dataRouter = new DataRouter(this._eventManager, this._dataStorage);
	this._dataRouter.setup(this._cypher);
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
