var sinon = require('sinon');

describe('The StaticFaviconRoute class', function () {
	var StaticFaviconRoute, sandbox, server;
	var url = 'lib/foo/bar';

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		server = {use: function () {}};

		StaticFaviconRoute = require('./../../../../../src/server/component/router/static-favicon-route');
	});
	afterEach(function () {
		sandbox.restore();
	});

	it ('should be a function', function () {
		StaticFaviconRoute.should.be.a('function');
	});

	it ('should invoke the server "use" with the expected filter', function () {
		sandbox.stub(server, 'use', function(filter) {
			filter.should.be.equal(StaticFaviconRoute.FILTER);
		});

		StaticFaviconRoute(server);
	});

	it('should invoke the sendFile on the response with the expected index file path', function () {
		var icon = 'hjagsvdjhfasdgajsd==';
		var res = {writeHead: function () {}, end: function () {}};
		var spy = sandbox.spy(res, 'end');

		sandbox.stub(server, 'use', function (filter, callback) {
			callback({}, res);
			spy.should.have.been.calledWith(new Buffer(icon, 'base64'));
		});

		StaticFaviconRoute(server, icon);
	});
});
