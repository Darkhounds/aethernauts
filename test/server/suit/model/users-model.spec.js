var sinon = require('sinon');

var Waterline = require('./../../mockups/waterline');
var AbstractModel = require('./../../mockups/model/abstract-model.mock');

describe('The Users Model Class', function () {
	var Users, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		Waterline.mockStart();
		AbstractModel.mockStart();
		Users = require('./../../../../src/server/model/users-model');
	});

	afterEach(function () {
		AbstractModel.mockStop();
		Waterline.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		Users.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;
		var waterline;

		beforeEach(function () {
			waterline = new Waterline();

			instance = new Users(waterline);
		});

		afterEach(function () {
			instance = null;
		});

		it ('Should inherit the "Abstract" class', function () {
			instance.should.be.an.instanceof(AbstractModel, 'instance is not a Abstract');
		});

		it ('Should created a default user when initializing', function () {
			var spy = sandbox.spy(instance, 'findOrCreate');

			instance.initialize();

			spy.should.have.been.calledOnce;
		});
	});
});
