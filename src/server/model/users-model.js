var Abstract = require('./abstract-model');
var Waterline = require('waterline');
var util = require('util');

function Constructor(waterline) {
	Abstract.call(this);

	this._waterline = waterline;

	this._schema = {
		identity: 'user',
		connection: 'default',
		attributes: {
			username: 'string',
			password: 'string',
			token: 'string'
		}
	};
	this._collection = Waterline.Collection.extend(this._schema);
	this._waterline.loadCollection(this._collection);
}
util.inherits(Constructor, Abstract);

module.exports = Constructor;