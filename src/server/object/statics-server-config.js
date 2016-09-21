function Constructor(root, port) {
	return {
		root: root,
		port: port,
		statics: root + Constructor.STATICS,
		index: root + Constructor.INDEX
	}
}

Constructor.STATICS = 'lib/';
Constructor.INDEX = 'index.html';

module.exports = Constructor;
