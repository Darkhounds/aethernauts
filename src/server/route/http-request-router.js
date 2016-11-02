var express = require('express');
var expressWs = require('express-ws');
var when = require('when');

var LoggerRoute = require('./statics/log-route');
var StaticAssetsRoute = require('./statics/static-assets-route');
var FaviconRoute = require('./statics/favicon-route');
var SaveFormHistoryRoute = require('./statics/save-form-history-route');
var StaticIndexRoute = require('./statics/static-index-route');
var WebsocketRoute = require('./statics/websocket-route');
var RegisterRoute = require('./statics/register-route');

var bodyParser = require('body-parser');

var Constructor = function (eventManager, dataStorage) {
	this._eventManager = eventManager;
	this._dataStorage = dataStorage;
	this._initialized = false;
	this._server = express();
	expressWs(this._server);

	this._logRoute = new LoggerRoute();
	this._staticAssetsRoute = new StaticAssetsRoute();
	this._faviconRoute = new FaviconRoute();
	this._saveFormHistoryRoute = new SaveFormHistoryRoute();
	this._staticIndexRoute = new StaticIndexRoute();
	this._websocketRoute = new WebsocketRoute(this._eventManager);
	this._registerRoute = new RegisterRoute(this._dataStorage);

	this._server.use(this._logRoute.execute.bind(this));
	this._server.post('/register', bodyParser.urlencoded({ extended: false }), this._registerRoute.execute.bind(this._registerRoute));
	this._server.ws('/server', this._websocketRoute.execute.bind(this._websocketRoute));
	this._server.use('*/lib/*', this._staticAssetsRoute.execute.bind(this._staticAssetsRoute));
	this._server.use('/favicon.ico', this._faviconRoute.execute.bind(this._faviconRoute));
	this._server.use('/save-form-history', this._saveFormHistoryRoute.execute.bind(this._saveFormHistoryRoute));
	this._server.use(this._staticIndexRoute.execute.bind(this._staticIndexRoute));
};
Constructor.MESSAGE_START = '-------- SERVING STATICS --------';
Constructor.ALREADY_INITIALIZED = 'AlreadyInitialized';

Constructor.prototype.setup = function (config, cypher) {
	this._config = config;

	this._registerRoute.setup(cypher);

	this._logRoute.setup(this._config);
	this._websocketRoute.setup(this._config);
	this._staticAssetsRoute.setup(this._config);
	this._faviconRoute.setup(this._config);
	this._saveFormHistoryRoute.setup(this._config);
	this._staticIndexRoute.setup(this._config);
};

Constructor.prototype.initialize = function () {
	return when.promise(this._initializePromise.bind(this));
};

Constructor.prototype._initializePromise = function (resolve, reject) {
	if (!this._initialized) {
		this._initialized = true;
		this._server.listen(this._config.port, function () {
			console.log(Constructor.MESSAGE_START);
		});

		resolve(this._server);
	} else reject(Constructor.ALREADY_INITIALIZED);
};

module.exports = Constructor;
