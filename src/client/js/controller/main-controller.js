var ConnectionEvent = require('./../event/connection-event');
var NotificationEvent = require('./../event/notification-event');

var BroadcasterService = require('./../service/broadcaster-service');
var ConnectionService = require('./../service/connection-service');

var MainView = require('./../view/main-view');

function Constructor () {
	this._broadcasterService = new BroadcasterService();
	this._connectionService = new ConnectionService();
	this._view = new MainView();

	this._handleConnectionDisconnected = this._handleConnectionDisconnected.bind(this);
	this._handleConnectionReconnected = this._handleConnectionReconnected.bind(this);
	this._handleDocumentStateChange = this._handleDocumentStateChange.bind(this);
}

Constructor.prototype._handleConnectionDisconnected = function () {
	this._broadcasterService.emit(NotificationEvent.DISCONNECTED);
};

Constructor.prototype._handleConnectionReconnected = function () {
	this._broadcasterService.emit(NotificationEvent.RECONNECTED);
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

Constructor.prototype.setup = function (address, port, path) {
	this._setupConnectionService(address, port, path);

	this._view.setup(this._broadcasterService, this._connectionService);

	document.addEventListener('readystatechange', this._handleDocumentStateChange);
	this._checkDocumentReady();
};

Constructor.prototype._setupConnectionService = function (address, port, path) {
	address = address || Constructor.DEFAULT_ADDRESS;
	port = port || Constructor.DEFAULT_PORT;
	path = path || Constructor.DEFAULT_PATH;
	this._connectionService.setup('ws://' + address + ':' + port + path);

	this._connectionService.on(ConnectionEvent.DISCONNECTED, this._handleConnectionDisconnected);
	this._connectionService.on(ConnectionEvent.RECONNECTED, this._handleConnectionReconnected);
};

Constructor.DEFAULT_ADDRESS = 'localhost';
Constructor.DEFAULT_PORT = 3001;
Constructor.DEFAULT_PATH = '/server';

module.exports = Constructor;
