var sinon = require('sinon');

var Waterline = require('./../../mockups/waterline');

var Abstract = require('./../../../../src/server/model/abstract-model');

describe('The XMPP Class', function () {
	var sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('Should exist', function () {
		Abstract.should.exist;
	});

	describe('As an instance', function () {
		var instance, waterline, collection;

		beforeEach(function () {
			waterline = new Waterline();
			collection = Waterline.mockCollection(waterline, 'abstract');
			instance = new Abstract(waterline);
		});

		afterEach(function () {
			instance = null;
		});

		it('Should delegate the "find" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'find');
			var query = {foo: 'bar'};
			instance.find(query);
			spy.should.have.been.calledWith(query);
		});

		it('Should delegate the "findOne" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'findOne');
			var query = {foo: 'bar'};
			instance.findOne(query);
			spy.should.have.been.calledWith(query);
		});

		it('Should delegate the "create" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'create');
			var query = {foo: 'bar'};
			instance.create(query);
			spy.should.have.been.calledWith(query);
		});

		it('Should delegate the "findOrCreate" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'findOrCreate');
			var query = {foo: 'bar'};
			instance.findOrCreate(query);
			spy.should.have.been.calledWith(query);
		});


		it('Should delegate the "update" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'update');
			var query = {foo: 'bar'};
			instance.update(query);
			spy.should.have.been.calledWith(query);
		});

		it('Should delegate the "destroy" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'destroy');
			var query = {foo: 'bar'};
			instance.destroy(query);
			spy.should.have.been.calledWith(query);
		});

		it('Should delegate the "query" invocation to the waterline collection', function () {
			var spy = sandbox.spy(collection, 'query');
			var query = {foo: 'bar'};
			instance.query(query);
			spy.should.have.been.calledWith(query);
		});
	});
});
