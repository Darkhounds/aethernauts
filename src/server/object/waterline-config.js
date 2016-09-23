var diskAdapter = require('sails-disk');

module.exports =  {
	adapters: {
		'disk': diskAdapter
	},

	connections: {
		default: {
			adapter: 'disk',
			filePath: 'data/'
		}
	}
};
