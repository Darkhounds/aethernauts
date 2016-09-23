var mock = require('mock-require');
var when = require('when');

var _instance = null;
var Constructor = function () {
	_instance = this;
};

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
};

module.exports = Constructor;
