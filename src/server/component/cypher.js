var md5 = require('md5');
var atob = require('abab').atob;

var Constructor = function () {
	this._config = null;
};

Constructor.prototype.setup = function (config) {
	this._config = config;
};

Constructor.prototype.encrypt = function (value) {
	return md5(value + this._config.secret);
};

Constructor.prototype.generateMask = function () {
	var mask = '';

	for (var i = 0; i < 32; i++) {
		mask += this._generateRandomChar();
	}

	return mask;
};

Constructor.prototype.decode = function (value) {
	return atob(value);
};

Constructor.prototype.unmask = function (masked, mask) {
	mask = new Buffer(mask);
	masked = masked.split(' ');

	var buffer = masked.reduce(function(reduced, value, id) {
		reduced[id] = parseInt(value, 16) ^ mask[id%mask.length];

		return reduced;
	}.bind(this), new Buffer(masked.length));

	return buffer.toString();
};

Constructor.prototype._generateRandomChar = function () {
	var charCode = String.fromCharCode(33 + Math.round(Math.random() * 93));

	return charCode;
};

module.exports = Constructor;