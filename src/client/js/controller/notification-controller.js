var NotificationEvent = require('./../event/notification-event');

var EmptyView = require('./../view/notification/empty-view');

var Constructor = function () {
	this._context = null;
	this._data = null;

	this._handleDisconnectedNotification = this._handleDisconnectedNotification.bind(this);
	this._handleReconnectedNotification = this._handleReconnectedNotification.bind(this);
};

Constructor.prototype._handleDisconnectedNotification = function () {
	console.log('disconnected');
};

Constructor.prototype._handleReconnectedNotification = function () {
	this._emptyView.render(this._context);
};

Constructor.prototype.setup = function (broadcasterService) {
	this._broadcasterService = broadcasterService;
	this._addBroadcasterServiceEvents();

	this._emptyView = new EmptyView();
};

Constructor.prototype._addBroadcasterServiceEvents = function () {
	this._broadcasterService.on(NotificationEvent.DISCONNECTED, this._handleDisconnectedNotification);
	this._broadcasterService.on(NotificationEvent.RECONNECTED, this._handleReconnectedNotification);
};

Constructor.prototype.setContext = function (context) {
	this._context = context;
	this._emptyView.render(this._context);
};

module.exports = Constructor;
