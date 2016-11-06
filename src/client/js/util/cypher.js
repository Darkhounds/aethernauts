var Buffer = require('buffer').Buffer;

var Constructor = function () {};

Constructor.prototype.setMask = function (mask) {
	this._mask = new Buffer(mask, 'utf-8');
};

Constructor.prototype.encode = function (value) {
	return btoa(value);
};

Constructor.prototype.mask = function (value) {
	var buffer = new Buffer(value);
	var maskedValue = buffer.reduce(this._maskValue.bind(this), '');

	return maskedValue;
};

Constructor.prototype._maskValue = function (reduced, value, id) {
	return reduced + (reduced?' ':'') + (value ^ this._mask[id%this._mask.length]).toString(16);
};

module.exports = Constructor;