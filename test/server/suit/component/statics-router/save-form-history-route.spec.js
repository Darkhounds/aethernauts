var sinon = require('sinon');

describe('The SaveFormHistoryRoute class', function () {
	var SaveFormHistoryRoute, sandbox, server;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		server = {use: function () {}};

		SaveFormHistoryRoute = require('./../../../../../src/server/component/statics-router/save-form-history-route');
	});
	afterEach(function () {
		sandbox.restore();
	});

	it ('should be a function', function () {
		SaveFormHistoryRoute.should.be.a('function');
	});

	it ('should invoke the server "use" with the expected filter', function () {
		sandbox.stub(server, 'use', function(filter) {
			filter.should.be.equal(SaveFormHistoryRoute.FILTER);
		});

		SaveFormHistoryRoute(server);
	});

	it('should invoke the end on the response with an empty value', function () {
		var res = {end: function () {}};
		var spy = sandbox.spy(res, 'end');

		sandbox.stub(server, 'use', function (filter, callback) {
			callback({}, res);
			spy.should.have.been.calledWith('');
		});

		SaveFormHistoryRoute(server);
	});
});
