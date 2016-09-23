var mock = require('mock-require');
var sinon = require('sinon');

var Constructor = sinon.stub();

Constructor.mockStart = function () {
	mock('./../../../../../src/server/component/statics-router/static-index-route', Constructor);
};
Constructor.mockStop = function () {
	Constructor.reset();
	mock.stop('./../../../../../src/server/component/statics-router/static-index-route');
};

module.exports = Constructor;