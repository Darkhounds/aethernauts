var expect = require('chai').expect;
var sinon = require('sinon');
var Socket = require('./../../mockups/socket.mock');

describe('The Connections class', function () {
	var Connections, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		Connections = require('./../../../../src/server/component/connections');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		Connections.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, username, user, socket;

		beforeEach(function () {
			username = 'bgus';
			user = {
				username: username
			};
			socket = new Socket();
			socket.user = user;
			instance = new Connections();
		});

		it('should be an instance of the Connections class', function () {
			instance.should.be.an.instanceOf(Connections);
		});

		it('should return the registered connection', function () {
			var expectedConnection = {
				socket: socket,
				checked: true
			};

			instance.add(socket);
			instance.get(username).should.eql(expectedConnection);
		});

		it('should fail silently when removing an unauthenticated socket', function () {
			delete socket.user;
			instance.remove(socket);
			expect(instance.get(username)).to.be.undefined;
		});

		it('should return an undefined value when requesting a removed connection', function () {
			instance.add(socket);
			instance.remove(socket);
			expect(instance.get(username)).to.be.undefined;
		});

		it('should iterate through all registered connections', function () {
			var spy = sandbox.spy();
			var connections = {};
			var createConnection = function (username, instance, connections) {
				var socket = new Socket();
				socket.user = {username: username};
				instance.add(socket);
				connections[username] = {
					socket: socket,
					checked: true
				};
			};
			var username1 = 'bogus1';
			var username2 = 'bogus2';
			var username3 = 'bogus3';

			createConnection(username1, instance, connections);
			createConnection(username2, instance, connections);
			createConnection(username3, instance, connections);

			instance.forEach(spy);

			spy.should.have.been.calledWith(connections[username1], username1, connections)
				.and.calledWith(connections[username2], username2, connections)
				.and.calledWith(connections[username3], username3, connections)
		});
	});
});