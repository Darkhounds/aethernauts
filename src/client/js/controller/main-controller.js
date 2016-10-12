var querystring = require('querystring');

var MainView = require('./../view/main-view');

function Constructor () {
	this._connectionService = require('./../service/connection-service');
	this._setupConnectionService();

	this._view = new MainView();

	this._addDocumentEventListeners();
	this._checkDocumentReady();
}

Constructor.prototype._setupConnectionService = function () {
	var params = querystring.decode(window.location.search.substr(1));
	var address = params.serverAddress || 'localhost';
	var port = params.serverPort || '3001';

	this._connectionService.setup('ws://' + address + ':' + port + '/server');
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
