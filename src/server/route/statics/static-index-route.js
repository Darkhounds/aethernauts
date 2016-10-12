var util = require('util');
var AbstractRoute = require('./abstract-route');

var Constructor = function () {};
util.inherits(Constructor, AbstractRoute);

Constructor.prototype.execute = function (req, res) {
	res.sendFile(this._config.index);
};

module.exports = Constructor;