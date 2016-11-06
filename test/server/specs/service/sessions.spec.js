var expect = require('chai').expect;
var sinon = require('sinon');

var Socket = require('./../../mockups/socket.mock');

describe('The Sessions class', function () {
	var Sessions, sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		Sessions = require('./../../../../src/server/service/sessions');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		Sessions.should.be.a('function');
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
			instance = new Sessions();
		});

		it('should be an instance of the Connections class', function () {
			instance.should.be.an.instanceOf(Sessions);
		});

		it('should return the registered session', function () {
			var expectedSession = {
				socket: socket,
				checked: true
			};

			instance.add(socket);
			instance.get(username).should.eql(expectedSession);
		});

		it('should fail silently when removing an unauthenticated socket', function () {
			delete socket.user;
			instance.remove(socket);
			expect(instance.get(username)).to.be.undefined;
		});

		it('should return an undefined value when requesting a removed session', function () {
			instance.add(socket);
			instance.remove(socket);
			expect(instance.get(username)).to.be.undefined;
		});

		it('should iterate through all registered sessions', function () {
			var spy = sandbox.spy();
			var sessions = {};
			var createSession = function (username, instance, sessions) {
				var socket = new Socket();
				socket.user = {username: username};
				instance.add(socket);
				sessions[username] = {
					socket: socket,
					checked: true
				};
			};
			var username1 = 'bogus1';
			var username2 = 'bogus2';
			var username3 = 'bogus3';

			createSession(username1, instance, sessions);
			createSession(username2, instance, sessions);
			createSession(username3, instance, sessions);

			instance.forEach(spy);

			spy.should.have.been.calledWith(sessions[username1], username1, sessions)
				.and.calledWith(sessions[username2], username2, sessions)
				.and.calledWith(sessions[username3], username3, sessions)
		});
	});
});