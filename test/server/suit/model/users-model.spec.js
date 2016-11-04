var sinon = require('sinon');

var Waterline = require('./../../mockups/waterline');
var AbstractModel = require('./../../mockups/model/abstract-model.mock');

describe('The Users Model Class', function () {
	var UsersModel, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		Waterline.mockStart();
		AbstractModel.mockStart();
		UsersModel = require('./../../../../src/server/model/users-model');
	});

	afterEach(function () {
		AbstractModel.mockStop();
		Waterline.mockStop();
		sandbox.restore();
	});

	it('should be a function', function () {
		UsersModel.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, defaultUsers;

		beforeEach(function () {
			defaultUsers = [
				{ type: 'god', username: 'username', password: 'password' },
				{ type: 'god', username: 'bogus', password: 'foo' }
			];

			instance = new UsersModel(defaultUsers);
		});

		it('should be an instance of "UsersModel" class', function () {
			instance.should.be.an.instanceof(UsersModel);
		});

		it('should be an instance of "Abstract" class', function () {
			instance.should.be.an.instanceof(AbstractModel);
		});

		describe('after setup', function () {
			var waterline;

			beforeEach(function () {
				waterline = new Waterline();

				instance.setup(waterline);
			});

			it('should create the first default user when initializing', function () {
				var spy = sandbox.spy(instance, 'findOrCreate');
				var defaultUser = defaultUsers[0];

				return instance.initialize().then(function () {
					spy.should.have.been.calledWith({username: defaultUser.username}, defaultUser);
				});
			});

			it('should create the second default user when initializing', function () {
				var spy = sandbox.spy(instance, 'findOrCreate');
				var defaultUser = defaultUsers[1];

				return instance.initialize().then(function () {
					spy.should.have.been.calledWith({username: defaultUser.username}, defaultUser);
				});
			});
		});
	});
});
