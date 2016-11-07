var sinon = require('sinon');

describe('The Save Form History Route class', function () {
	var SaveHistoryRoute, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		SaveHistoryRoute = require('./../../../../../src/server/routers/statics/save-form-history-route');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		SaveHistoryRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function() {
			instance = new SaveHistoryRoute();
		});

		it('should be an instance of SaveHistoryRoute', function () {
			instance.should.be.an.instanceOf(SaveHistoryRoute);
		});

		it('should end the response with an empty string', function () {
			var spy = sandbox.spy();
			var res = { end: spy };

			instance.execute({}, res)

			spy.should.have.been.calledOnce;
		});
	});
});