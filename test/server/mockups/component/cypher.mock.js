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

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/component/cypher', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/component/cypher');
	Constructor.reset();
	_responses.length = 0;
};

var _responses = [];
Constructor.addResponse = function (response) {
	_responses.push(response);
};

module.exports = Constructor;
