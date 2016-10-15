var mock = require('mock-require');
var sinon = require('sinon');
var when = require('when');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});

Constructor.prototype.setup = function () {};

Constructor.prototype.find = function () {
	return _createPromise();
};

Constructor.prototype.findOne = function () {
	return _createPromise();
};

Constructor.prototype.create = function () {
	return _createPromise();
};

Constructor.prototype.findOrCreate = function () {
	return _createPromise();
};

Constructor.prototype.update = function () {
	return _createPromise();
};

Constructor.prototype.destroy = function () {
	return _createPromise();
};

Constructor.prototype.query = function () {
	return _createPromise();
};

Constructor.prototype.initialize = function () {};

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
	mock('./../../../../src/server/model/abstract-model', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/model/abstract-model');
	Constructor.reset();
};

module.exports = Constructor;
