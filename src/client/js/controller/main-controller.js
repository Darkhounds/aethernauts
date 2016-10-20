var MainView = require('./../view/main-view');
var ConnectionService = require('./../service/connection-service');

function Constructor () {
	this._connectionService = new ConnectionService();
	this._view = new MainView();
}

Constructor.DEFAULT_ADDRESS = 'localhost';
Constructor.DEFAULT_PORT = 3001;
Constructor.DEFAULT_PATH = '/server';

Constructor.prototype.setup = function (address, port, path) {
	address = address || Constructor.DEFAULT_ADDRESS;
	port = port || Constructor.DEFAULT_PORT;
	path = path || Constructor.DEFAULT_PATH;
	this._connectionService.setup('ws://' + address + ':' + port + path);
	this._view.setup(this._connectionService);

	this._addDocumentEventListeners();
	this._checkDocumentReady();
};

Constructor.prototype._addDocumentEventListeners = function () {
	this._handleDocumentStateChange = this._handleDocumentStateChange.bind(this);
	document.addEventListener('readystatechange', this._handleDocumentStateChange);
};

Constructor.prototype._handleDocumentStateChange = function () {
	this._checkDocumentReady();
};

Constructor.prototype._checkDocumentReady = function () {
	if (document.readyState === 'complete') {
		document.removeEventListener('readystatechange', this._handleDocumentStateChange);
		this._view.render(document);
	}
};

module.exports = Constructor;
