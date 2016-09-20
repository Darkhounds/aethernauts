var sinon = require('sinon');

describe('The StaticIndexRoute class', function () {
	var StaticIndexRoute, sandbox, server;
	var url = 'lib/foo/bar';

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		server = {use: function () {}};

		StaticIndexRoute = require('./../../../../../src/server/component/router/static-index-route');
	});
	afterEach(function () {
		sandbox.restore();
	});

	it ('should be a function', function () {
		StaticIndexRoute.should.be.a('function');
	});

	it ('should invoke the server "use" without any filter', function () {
		sandbox.stub(server, 'use', function(callback) {
			callback.should.be.a('function');
		});

		StaticIndexRoute(server);
	});


	it('should invoke the sendFile on the response with the expected index file path', function () {
		var index = 'index.html';
		var res = {sendFile: function () {}};
		var spy = sandbox.spy(res, 'sendFile');

		sandbox.stub(server, 'use', function (callback) {
			callback({}, res);
			spy.should.have.been.calledWith(index);
		});

		StaticIndexRoute(server, index);
	});
});
