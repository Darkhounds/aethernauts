var mock = require('mock-require');
var sinon = require('sinon');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.setup = function () {};
Constructor.prototype.encrypt = function () {
	return _responses.shift();
};
Constructor.prototype.generateMask = function () {
	return _responses.shift();
};
Constructor.prototype.decode = function () {
	return _responses.shift();
};
Constructor.prototype.unmask = function () {
	return _responses.shift();
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/service/cypher', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/service/cypher');
	Constructor.restore();
};

var _responses = [];
Constructor.addResponse = function (response) {
	_responses.push(response);
};

Constructor.restore = function () {
	_responses.length = 0;
	Constructor.reset();
};

module.exports = Constructor;
