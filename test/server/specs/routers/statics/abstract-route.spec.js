describe('The Abstract Route class', function () {
	var AbstractRoute;

	beforeEach(function () {
		AbstractRoute = require('./../../../../../src/server/routers/statics/abstract-route');
	});

	it('should be a function', function () {
		AbstractRoute.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new AbstractRoute();
		});

		it('should be an instance of AbstractRoute', function () {
			instance.should.be.an.instanceOf(AbstractRoute);
		});

		it('should resolve calls to the setup method', function () {
			instance.setup();
		});
	});
});
