var MainView = require('./../view/main-view');

function Constructor () {
	this._view = new MainView();

	this._addDocumentEventListeners();
	this._checkDocumentReady();
}

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
