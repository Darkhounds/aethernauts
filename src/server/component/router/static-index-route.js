function Constructor (server, index) {
	server.use(function (req, res) {
		res.sendFile(index);
	});
}

module.exports = Constructor;