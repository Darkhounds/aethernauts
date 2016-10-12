var Waterline = require('waterline');

function Constructor() {
	this._schema = {
		identity: 'abstract'
	};
}

Constructor.prototype.setup = function (waterline) {
	this._collection = Waterline.Collection.extend(this._schema);
	this._waterline = waterline;
	this._waterline.loadCollection(this._collection);
};

Constructor.prototype._getInstance = function () {
	return this._waterline.collections[this._schema.identity];
};

Constructor.prototype.find = function (criteria) {
	return this._getInstance().find(criteria);
};

Constructor.prototype.findOne = function (criteria) {
	return this._getInstance().findOne(criteria);
};

Constructor.prototype.create = function (criteria) {
	return this._getInstance().create(criteria);
};

Constructor.prototype.findOrCreate = function (criteria, values) {
	return this._getInstance().findOrCreate(criteria, values);
};

Constructor.prototype.update = function (criteria, values) {
	return this._getInstance().update(criteria, values);
};

Constructor.prototype.destroy = function (criteria) {
	return this._getInstance().destroy(criteria);
};

Constructor.prototype.query = function (query, data) {
	return this._getInstance().query(query, data);
};

Constructor.prototype.initialize = function () { };

module.exports = Constructor;