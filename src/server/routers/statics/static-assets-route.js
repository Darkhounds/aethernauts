var util = require('util');
var AbstractRoute = require('./abstract-route');

var Constructor = function () {};
util.inherits(Constructor, AbstractRoute);

Constructor.prototype.execute = function (req, res) {
	var url = req.baseUrl.split('lib/')[1];
	res.sendFile(this._config.statics + '/' + url);
};

module.exports = Constructor;