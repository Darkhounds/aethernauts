var Constructor = function () {
	this._config = null;
};

Constructor.prototype.setup = function (config) {
	this._config = config;
};

module.exports = Constructor;
