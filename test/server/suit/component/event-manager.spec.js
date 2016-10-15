describe ('The Event Manager class', function () {
	var EventManager;

	beforeEach(function () {
		EventManager = require('./../../../../src/server/component/event-manager');
	});

	it('should be a function', function () {
		EventManager.should.be.a('function');
	});
	
	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new EventManager();
		});

		it ('should be an instance of EventManager', function () {
			instance.should.be.an.instanceOf(EventManager);
		});
	});
});
