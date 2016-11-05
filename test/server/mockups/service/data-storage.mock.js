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

var _createPromise = function () {
	var response = _responses.length ? _responses.shift() : {};
	return response.error ? when.reject(response.error) : when.resolve(response.data);

};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/service/data-storage', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/service/data-storage');
	Constructor.restore()
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

