var diskAdapter = require('sails-disk');

var Constructor = function (storageLocation) {
	this.adapters =  {
		'disk': diskAdapter
	};

	this.connections =  {
		default: {
			adapter: 'disk',
			filePath: storageLocation
		}
	};
};

module.exports = Constructor;