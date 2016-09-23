var express = require('express');
var ServerConfigObject = require('./../object/statics-server-config');
var StaticsRouter = require('./../component/router/statics-router');

function Constructor (root, port) {
	this._listening = false;
	this._server = express();
	this._config = new ServerConfigObject(root, port);
	this._router = new StaticsRouter(this._server);
}

Constructor.MESSAGE_START = '-------- SERVING STATICS --------';

Constructor.prototype.connect = function () {
	if (!this._listening) {
		this._listening = true;

		this._router.addLogger();
		this._router.addStaticAssets(this._config.statics);
		this._router.addStaticFavicon(this._config.data);
		this._router.addSaveFormHistory();
		this._router.addStaticIndex(this._config.index);

		this._server.listen(this._config.port, function () {
			console.log(Constructor.MESSAGE_START);
		});
	}
};

module.exports = Constructor;