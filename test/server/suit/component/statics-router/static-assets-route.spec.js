var sinon = require('sinon');

describe('The StaticAssetsRoute class', function () {
	var StaticAssetsRoute, sandbox, server;
	var url = 'lib/foo/bar';

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		server = {use: function () {}};

		StaticAssetsRoute = require('./../../../../../src/server/component/statics-router/static-assets-route');
	});
	afterEach(function () {
		sandbox.restore();
	});

	it ('should be a function', function () {
		StaticAssetsRoute.should.be.a('function');
	});
	
	it('should invoke the server "use" with the expected filter', function () {
		sandbox.stub(server, 'use', function (filter, callback) {
			filter.should.equal(StaticAssetsRoute.FILTER);
		});

		StaticAssetsRoute(server);
	});

	it('should invoke the sendFile on the response with the expected file path', function () {
		var statics = 'lib';
		var req = { baseUrl: url };
		var res = {sendFile: function () {}};
		var spy = sandbox.spy(res, 'sendFile');

		sandbox.stub(server, 'use', function (filter, callback) {
			callback(req, res);
			spy.should.have.been.calledWith(statics + '/foo/bar');
		});

		StaticAssetsRoute(server, statics);
	});
});
