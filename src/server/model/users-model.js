var util = require('util');
var when = require('when');

var Abstract = require('./abstract-model');

function Constructor(users) {
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
	this._defaultUsers = users;
}
util.inherits(Constructor, Abstract);

Constructor.prototype.initialize = function () {
	var promise  = when.resolve();

	this._defaultUsers.forEach(this._handleDefaultUserIteration.bind(this, promise));

	return promise;
};

Constructor.prototype._handleDefaultUserIteration = function (promise, defaultUser) {
	promise.then(this._handleDefaultUserFindOrCreate.bind(this, defaultUser));
};

Constructor.prototype._handleDefaultUserFindOrCreate = function (defaultUser) {
	return this.findOrCreate({username: defaultUser.username}, defaultUser);
};



module.exports = Constructor;