var sinon = require('sinon');

describe('The Data Route class', function() {
	var DataRoute, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		DataRoute = require('./../../../../../src/server/route/data/unknown-route');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		DataRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new DataRoute();
		});

		it('should be an instance of DataRoute', function () {
			instance.should.be.an.instanceOf(DataRoute);
		});

		it('should invoke the send method of the data socket', function () {
			var spy = sandbox.spy();
			var data = {
				_socket: {
					send: spy
				}
			};
			return instance.execute(data).then(function () {
				spy.should.have.been.called;
			});
		});
	});
});