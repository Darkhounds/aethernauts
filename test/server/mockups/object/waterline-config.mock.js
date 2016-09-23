var mock = require('mock-require');
var memoryAdapter = require('sails-memory');

var instance = {
	adapters: {
		'memory': memoryAdapter
	},
	connections: {
		default: {
			adapter: 'memory'
		}
	}
};

instance.mockStart = function () {
	mock('./../../../../src/server/object/waterline-config', instance);
};
instance.mockStop = function () {
	mock.stop('./../../../../src/server/object/waterline-config');
};

module.exports = instance;