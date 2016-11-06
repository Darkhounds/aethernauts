var EventEmitter = require('events').EventEmitter;

describe('The Broadcaster Service class', function () {
	var BroadcasterService;

	beforeEach(function () {
		BroadcasterService = require('./../../../../src/client/js/service/broadcaster-service');
	});

	it('should be a function', function () {
		BroadcasterService.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new BroadcasterService();
		});

		it('should be an instance of the BroadcasterService class', function () {
			instance.should.be.an.instanceOf(BroadcasterService);
		});

		it('should be an instance of the EventEmitter class', function () {
			instance.should.be.an.instanceOf(EventEmitter);
		});
	});
});