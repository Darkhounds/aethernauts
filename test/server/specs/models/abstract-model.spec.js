var sinon = require('sinon');

var Waterline = require('./../../mockups/waterline');

describe('The Abstract Model Class', function () {
	var Abstract, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		Waterline.mockStart();

		Abstract = require('./../../../../src/server/models/abstract-model');
	});
	afterEach(function () {
		Waterline.mockStop();

		sandbox.restore();
	});

	it('should be a function', function () {
		Abstract.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, waterline, collection;

		beforeEach(function () {
			waterline = new Waterline();
			collection = Waterline.mockCollection(waterline, 'abstract');
			instance = new Abstract();
			instance.setup(waterline);
		});
		afterEach(function () {
			instance = null;
		});

		it('should delegate the "find" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'find');
			var query = {foo: 'bar'};
			instance.find(query);
			spy.should.have.been.calledWith(query);
		});

		it('should delegate the "findOne" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'findOne');
			var query = {foo: 'bar'};
			instance.findOne(query);
			spy.should.have.been.calledWith(query);
		});

		it('should delegate the "create" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'create');
			var query = {foo: 'bar'};
			instance.create(query);
			spy.should.have.been.calledWith(query);
		});

		it('should delegate the "findOrCreate" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'findOrCreate');
			var query = {foo: 'bar'};
			instance.findOrCreate(query);
			spy.should.have.been.calledWith(query);
		});

		it('should delegate the "update" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'update');
			var query = {foo: 'bar'};
			instance.update(query);
			spy.should.have.been.calledWith(query);
		});

		it('should delegate the "destroy" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'destroy');
			var query = {foo: 'bar'};
			instance.destroy(query);
			spy.should.have.been.calledWith(query);
		});

		it('should delegate the "query" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'query');
			var query = {foo: 'bar'};
			instance.query(query);
			spy.should.have.been.calledWith(query);
		});

		it('should resolve calls to the initialize method', function () {
			instance.initialize();
		});
	});
});
