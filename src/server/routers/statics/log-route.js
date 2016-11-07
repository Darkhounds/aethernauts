var util = require('util');
var AbstractRoute = require('./abstract-route');

var Constructor = function () {};
util.inherits(Constructor, AbstractRoute);

Constructor.prototype.execute = function (req, res, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var path = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log(Constructor.PREFIX, ip, path);

	next();
};

Constructor.PREFIX = 'STATIC ASSET SERVED:';

module.exports = Constructor;
