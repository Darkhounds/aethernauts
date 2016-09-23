function Constructor (server) {
	server.use(function(req, res, next) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var path = req.protocol + '://' + req.get('host') + req.originalUrl;

		console.log(Constructor.PREFIX, ip, path);

		next();
	});
}

Constructor.PREFIX = 'STATIC ASSET SERVED:';

module.exports = Constructor;