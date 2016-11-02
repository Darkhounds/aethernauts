var md5 = require('md5');

var Constructor = function () {
	this._config = null;
};

Constructor.prototype.setup = function (config) {
	this._config = config;
};

Constructor.prototype.encrypt = function (value) {
	return md5(value + this._config.secret);
};

module.exports = Constructor;