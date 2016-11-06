var sinon = require('sinon');
var mock = require('mock-require');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.setMask = function () {};

Constructor.prototype.encode = function () {
	return _responses.shift();
};

Constructor.prototype.mask = function () {
	return _responses.shift();
};

Constructor.mockStart = function () {
	mock('./../../../../src/client/js/util/cypher', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/client/js/util/cypher');
	Constructor.restore();
};

Constructor.getInstance = function () {
	return _instance;
};
var _responses = [];

Constructor.addResponse = function (response) {
	_responses.push(response)
};

Constructor.restore = function () {
	_responses.length = 0;
	Constructor.reset();
};

module.exports = Constructor;
