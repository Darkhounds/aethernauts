function Constructor (server, data) {
	server.use(Constructor.FILTER, function (req, res) {
		var icon = new Buffer(data, 'base64');
		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': icon.length
		});
		res.end(icon);
	});
}

Constructor.FILTER = '/favicon.ico';

module.exports = Constructor;