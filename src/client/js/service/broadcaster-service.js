var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Constructor = function () {};
util.inherits(Constructor, EventEmitter);

module.exports = Constructor;
