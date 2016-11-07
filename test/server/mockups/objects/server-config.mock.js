var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;

var Constructor = sinon.spy(function () {
	_instance = this;
	this.defaultUsers = _defaultUsers;
	this.secret = _secret;
});

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/objects/server-config', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/objects/server-config');
	Constructor.restore();
};
var _defaultUsers = null;

Constructor.setDefaultUsers = function (defaultUsers) {
	_defaultUsers = defaultUsers;
};
var _secret = null;

Constructor.setSecret = function (secret) {
	_secret = secret;
};

Constructor.restore = function () {
	_defaultUsers = null;
	_secret = null;
	Constructor.reset();
};

module.exports = Constructor;
