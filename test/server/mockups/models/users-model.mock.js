var mock = require('mock-require');
var sinon = require('sinon');
var util = require('util');

var AbstractModel = require('./abstract-model.mock');

var _instance = null;
var Constructor = sinon.spy(function () {
	_instance = this;
});
util.inherits(Constructor, AbstractModel);

Constructor.addResponse = function (error, data) {
	AbstractModel.addResponse(error, data);
};

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/models/users-model', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/models/users-model');
	Constructor.restore();
};

Constructor.restore = function () {
	AbstractModel.restore();
	Constructor.reset();
};

module.exports = Constructor;
