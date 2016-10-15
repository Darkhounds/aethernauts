var mock = require('mock-require');
var sinon = require('sinon');
var when = require('when');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.addModel = function () {};
Constructor.prototype.getModel = function () {};
Constructor.prototype.initialize = function () {
	return _createPromise();
};
Constructor.prototype.setup = function () {};

var _responses = [];
Constructor.addResponse = function (error, data) {
	_responses.push({ error: error, data: data });
};

var _createPromise = function () {
	var response = _responses.length ? _responses.shift() : {};

	return response.error ? when.reject(response.error) : when.resolve(response.data);
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/component/data-storage', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/component/data-storage');
	Constructor.reset();
};

module.exports = Constructor;
