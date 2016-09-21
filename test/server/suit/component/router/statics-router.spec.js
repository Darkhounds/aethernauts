var sinon = require('sinon');
var LoggerRoute = require('./../../../mockups/component/router/logger-route');
var StaticAssetsRoute = require('./../../../mockups/component/router/static-assets-route');
var StaticIndexRoute = require('./../../../mockups/component/router/static-index-route');

describe('The StaticsRouter class', function () {
	var StaticsRouter, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		LoggerRoute.mockStart();
		StaticAssetsRoute.mockStart();
		StaticIndexRoute.mockStart();
		StaticsRouter = require('./../../../../../src/server/component/router/statics-router');
	});
	afterEach(function () {
		StaticIndexRoute.mockStop();
		StaticAssetsRoute.mockStop();
		LoggerRoute.mockStop();
		sandbox.restore();
	});

	describe('as an instance', function () {
		var instance, server;

		beforeEach(function () {
			server = { use: function () {} };
			instance = new StaticsRouter(server);
		});
		afterEach(function () {
			instance = null;
		});
		
		it('should use the "LoggerRoute" class when invoking the addLogger method', function () {
			instance.addLogger();

			LoggerRoute.should.have.been.calledWith(server);
		});
		
		it('should use the "StaticAssetsRoute" class when invoking the addStaticAssets method', function () {
			var statics = 'lib/';
			
			instance.addStaticAssets(statics);

			StaticAssetsRoute.should.have.been.calledWith(server, statics);
		});

		it('should use the "StaticIndexRoute" class when invoking the addStaticIndex method', function () {
			var index = 'index.html';
			
			instance.addStaticIndex(index);

			StaticIndexRoute.should.have.been.calledWith(server, index);
		});
	});
});
