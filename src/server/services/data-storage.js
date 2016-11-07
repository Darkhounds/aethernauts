var when = require('when');
var Waterline = require('waterline');

var Constructor = function () {
	this._initialized = false;
	this._waterline = new Waterline();
	this._models = [];
};

Constructor.prototype.setup = function (config) {
	this._config = config;
};

Constructor.prototype.addModel = function (name, model) {
	model.setup(this._waterline);

	this._models.push({name: name, model: model});

	return model;
};

Constructor.prototype.getModel = function (name) {
	for (var i in this._models) {
		if (this._models[i].name.toLowerCase() === name.toLowerCase()) {
			return this._models[i].model;
		}
	}

	return null;
};

Constructor.prototype.initialize = function () {
	var promise = when.promise(this._initializePromise.bind(this));

	this._models.forEach(function (item) {
		promise = promise.then(item.model.initialize.bind(item.model));
	});

	return promise;
};

Constructor.prototype._initializePromise = function (resolve, reject) {
	if (!this._initialized) {
		this._initialized = true;
		this._waterline.initialize(this._config, this._handleInitialized.bind(this, resolve));
	} else reject(Constructor.ALREADY_INITIALIZED);
};

Constructor.prototype._handleInitialized = function (resolve) {
	resolve(this);
};

Constructor.ALREADY_INITIALIZED = 'AlreadyInitialized';

module.exports = Constructor;
