var LoggerRoute = require('./logger-route');
var StaticAssetsRoute = require('./static-assets-route');
var StaticFaviconRoute = require('./static-favicon-route');
var SaveFormHistoryRoute = require('./save-form-history-route');
var StaticIndexRoute = require('./static-index-route');

function Constructor (server) {
	this._server = server;
}

Constructor.prototype.addLogger = function () {
	LoggerRoute(this._server);
};
Constructor.prototype.addStaticAssets = function (statics) {
	StaticAssetsRoute(this._server, statics);
};
Constructor.prototype.addStaticFavicon = function (data) {
	StaticFaviconRoute(this._server, data);
};
Constructor.prototype.addSaveFormHistory = function () {
	SaveFormHistoryRoute(this._server);
};
Constructor.prototype.addStaticIndex = function (index) {
	StaticIndexRoute(this._server, index);
};

module.exports = Constructor;