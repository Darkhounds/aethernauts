var util = require('util');

var Abstract = require('./abstract-model');

function Constructor() {
	this._schema = {
		identity: 'user',
		connection: 'default',
		attributes: {
			type: 'string',
			username: 'string',
			password: 'string',
			token: 'string',
			character: 'string'
		}
	};
}
util.inherits(Constructor, Abstract);

Constructor.prototype.initialize = function () {
	var defaultUser = { type: 'god', username: 'username', password: 'password' };

	return this.findOrCreate({username: defaultUser.username}, defaultUser);
};

module.exports = Constructor;