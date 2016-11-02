var when = require('when');

var EventManager = require('./../component/event-manager');

var WaterlineConfig = require('./../object/waterline-config');
var ServerConfig = require('./../object/server-config');
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

	this._setupDataStorage();
	this._setupHTTPRequestRouter();
	this._setupDataRouter();
};

Constructor.prototype._setupDataStorage = function () {
	this._dataStorage = new DataStorage();
	this._dataStorage.setup(this._waterlineConfig);

	var userModel = this._createUsersModel();
	this._dataStorage.addModel('users', userModel);
};

Constructor.prototype._createUsersModel = function () {
	var userModel = new UsersModel(this._serverConfig.defaultUsers);
	return userModel;
};

Constructor.prototype._setupHTTPRequestRouter = function () {
	this._httpRequestRouter = new HTTPRequestRouter(this._eventManager, this._dataStorage);
	this._httpRequestRouter.setup(this._serverConfig);
};

Constructor.prototype._setupDataRouter = function () {
	this._dataRouter = new DataRouter(this._eventManager, this._dataStorage);
	this._dataRouter.setup(this._serverConfig);
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
