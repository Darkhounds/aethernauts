var mock = require('mock-require');
var sinon = require('sinon');
var util = require('util');

var WaterlineConfig = require('./../../../../src/server/object/waterline-config');

var _instance = null;

var Constructor = sinon.spy(function (storageLocation) {
	_instance = new WaterlineConfig(storageLocation);

	return _instance;
});

util.inherits(Constructor, WaterlineConfig);

Constructor.getInstance = function () {
	return _instance;
};

Constructor.mockStart = function () {
	mock('./../../../../src/server/object/waterline-config', Constructor);
};

Constructor.mockStop = function () {
	mock.stop('./../../../../src/server/object/waterline-config');
	Constructor.reset();
};

module.exports = Constructor;