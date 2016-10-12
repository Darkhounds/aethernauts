var when = require('when');

var EventManager = require('./../component/event-manager');

var DataStorage = require('./../component/data-storage');
var UsersModel = require('./../model/users-model');

var HTTPRequestRouter = require('./../route/http-request-router');
var DataRouter = require('./../route/data-router');

var Constructor = function (port, root) {
	this._eventManager = new EventManager();

	this._setupDataStorage(root);
	this._setupServer(port, root);

	this._dataRouter = new DataRouter(this._eventManager, this._dataStorage);
};

Constructor.prototype._setupDataStorage = function (root) {
	this._dataStorage = new DataStorage();
	this._dataStorage.setup(root + 'data/');
	this._dataStorage.addModel('users', new UsersModel());
};

Constructor.prototype._setupServer = function (port, root) {
	this._httpRequestRouter = new HTTPRequestRouter(this._eventManager);
	this._httpRequestRouter.setup(port, root);
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
