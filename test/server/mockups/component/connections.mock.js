var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.add = function () {};
Constructor.prototype.get = function () {
	return _responses.shift();
};
Constructor.prototype.remove = function () {};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/component/connections', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/component/connections');
	Constructor.reset();
	_responses.length = 0;
};

var _responses = [];
Constructor.addResponse = function (response) {
	_responses.push(response);
};

module.exports = Constructor;
