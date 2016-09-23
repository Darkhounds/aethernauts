function Constructor (server, statics) {
	server.use(Constructor.FILTER, function (req, res) {
		var url = req.baseUrl.split('lib/')[1];
		res.sendFile(statics + '/' + url);
	});
}
Constructor.FILTER = '*/lib/*';
module.exports = Constructor;