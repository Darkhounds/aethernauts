var NotificationEvent = require('./../event/notification-event');

var EmptyView = require('./../view/notification/empty-view');
var DisconnectedView = require('./../view/notification/disconnected-view');

var Constructor = function () {
	this._context = null;
	this._data = null;
	this._active = null;


	this._handleDisconnectedNotification = this._handleDisconnectedNotification.bind(this);
	this._handleReconnectedNotification = this._handleReconnectedNotification.bind(this);
};

Constructor.prototype._handleDisconnectedNotification = function () {
	if(this._active !== this._disconnectedView) {
		this._active = this._disconnectedView;
		this._disconnectedView.render(this._context);
	}
};

Constructor.prototype._handleReconnectedNotification = function () {
	if(this._active === this._disconnectedView) {
		this._emptyView.render(this._context);
		this._active = null;
	}
};

Constructor.prototype.setup = function (broadcasterService) {
	this._broadcasterService = broadcasterService;
	this._addBroadcasterServiceEvents();

	this._emptyView = new EmptyView();
	this._disconnectedView = new DisconnectedView();
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
