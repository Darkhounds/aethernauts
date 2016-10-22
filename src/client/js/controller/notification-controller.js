var NotificationEvent = require('./../event/notification-event');

var Constructor = function () {
	this._context = null;
	this._data = null;
};

Constructor.prototype.setup = function (broadcasterService) {
	this._broadcasterService = broadcasterService;
	this._addBroadcasterServiceEvents();
};

Constructor.prototype._addBroadcasterServiceEvents = function () {
	this._broadcasterService.on(NotificationEvent.DISCONNECTED, this._handleDisconnectedNotification);
	this._broadcasterService.on(NotificationEvent.RECONNECTED, this._handleReconnectedNotification);
};

Constructor.prototype._handleDisconnectedNotification = function () {
	console.log('disconnected');
};

Constructor.prototype._handleReconnectedNotification = function () {
	console.log('reconnected');
};

Constructor.prototype.setContext = function (context) {
	this._context = context;
	console.log(context);
};

module.exports = Constructor;
