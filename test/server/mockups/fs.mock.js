var mock = require('mock-require');

var _instance;

var Constructor = function () {
	_instance = this;
};

Constructor.prototype.readFileSync = function () {
	if (_responses.length) return _responses.shift();
	else throw('');
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

Constructor.restore = function () {
	_responses.length = 0
};

module.exports = Constructor;
