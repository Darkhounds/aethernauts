var mock = require('mock-require');
var sinon = require('sinon');
var when = require('when');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.setup = function () {};
Constructor.prototype.initialize = function () {
	return _createPromise();
};

var _createPromise = function () {
	var response = _responses.length ? _responses.shift() : {};

	return response.error ? when.reject(response.error) : when.resolve(response.data);
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/routers/http-request-router', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/routers/http-request-router');
	Constructor.restore();
};

var _responses = [];
Constructor.addResponse = function (error, data) {
	_responses.push({ error: error, data: data });
};

Constructor.restore = function () {
	_responses.length = 0;
	Constructor.reset();
};

module.exports = Constructor;
