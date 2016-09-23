function Constructor (server) {
	server.use(Constructor.FILTER, function (req, res) {
		res.end('');
	});
}

Constructor.FILTER = '/save-form-history';

module.exports = Constructor;