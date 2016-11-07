var util = require('util');
var AbstractRoute = require('./abstract-route');

var Constructor = function () {};
util.inherits(Constructor, AbstractRoute);

Constructor.prototype.execute = function (req, res) {
	var icon = new Buffer(this._config.favicon, 'base64');
	res.writeHead(200, {
		'Content-Type': 'image/png',
		'Content-Length': icon.length
	});
	res.end(icon);
};

module.exports = Constructor;