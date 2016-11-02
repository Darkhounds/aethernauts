var mock = require('mock-require');

var _instance;

var Constructor = function () {
	_instance = this;
};

Constructor.prototype.accessSync = function () {
	return _responses.shift();
};

Constructor.prototype.readFileSync = function () {
	return _responses.shift();
};

Constructor.mockStart = function () { mock('fs', new Constructor()); };

Constructor.mockStop = function () { mock.stop('fs'); };

Constructor.getInstance = function () {
	return _instance;
};

var _responses = [];
Constructor.addResponse = function (response) {
	_responses.push(response);
};

module.exports = Constructor;
