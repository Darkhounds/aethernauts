var Waterline = require('./../../mockups/waterline');

var AbstractModel = require('./../../mockups/model/abstract-model.mock');

describe('The Users Model Class', function () {
	var Users;

	beforeEach(function () {
		Waterline.mockStart();
		AbstractModel.mockStart();
		Users = require('./../../../../src/server/model/users-model');
	});

	afterEach(function () {
		AbstractModel.mockStop();
		Waterline.mockStop();
	});

	it('Should exist', function () {
		Users.should.exist;
	});

	describe('As an instance', function () {
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
	});
});
