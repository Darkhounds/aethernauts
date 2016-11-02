var util = require('util');
var AbstractRoute = require('./abstract-route');

var Constructor = function (dataStorage) {
	this._dataStorage = dataStorage;
	this._usersModel = this._dataStorage.getModel('users');
};
util.inherits(Constructor, AbstractRoute);

Constructor.prototype.setup = function (cypher) {
	this._cypher = cypher;
};

Constructor.prototype.execute = function (req, res) {
	var data = {
		email: req.body.email.toLowerCase(),
		username: req.body.username.toLowerCase(),
		password: this._cypher.encrypt(req.body.password),
		character: req.body.character
	};

	var filter = { or:[
		{ email: data.email },
		{ username: data.username },
		{ character: data.character }
	]};

	return this._usersModel.find(filter)
		.then(this._checkExistingUser.bind(this))
		.then(this._createUser.bind(this, data))
		.then(this._sendSuccess.bind(this, res))
		.catch(this._sendFailure.bind(this, res, data));
};

Constructor.prototype._checkExistingUser = function (results) {
	if (results.length) {
		throw('alreadyRegistered', results);
	}
};

Constructor.prototype._createUser = function (data) {
	data.type = 'user';
	data.token = 'bogus';
	return this._usersModel.create(data);
};

Constructor.prototype._sendSuccess = function (res, user) {
	res.end(JSON.stringify({command: 'registration', valid: true, token: user.token}));
};

Constructor.prototype._sendFailure = function (res, data, results) {
	var errors = {};

	results.forEach(function (user) {
		if(data.email === user.email) {
			errors['email'] = true;
		}
		if(data.username === user.username) {
			errors['username'] = true;
		}
		if(data.character === user.character) {
			errors['character'] = true;
		}
	});

	res.end(JSON.stringify({command: 'registration', valid: false, errors: Object.getOwnPropertyNames(errors)}));
};


module.exports = Constructor;