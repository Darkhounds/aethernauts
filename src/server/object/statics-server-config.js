function Constructor(root, port) {
	return {
		root: root,
		port: port,
		index: root + 'index.html'
	}
}

module.exports = Constructor;
