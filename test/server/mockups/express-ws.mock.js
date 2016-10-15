var mock = require('mock-require');

var _instance = null;

function Constructor(express) {
	express.ws = function () {};

	_instance = this;
}

Constructor.mockStart = function () {
	mock('express-ws', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('express-ws');
};

module.exports = Constructor;
