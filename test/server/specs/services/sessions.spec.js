var expect = require('chai').expect;
var sinon = require('sinon');

var Socket = require('./../../mockups/socket.mock');

describe('The Sessions class', function () {
	var Sessions, sandbox, username, user, socket;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();

		username = 'bogus';
		user = {
			username: username
		};
		socket = new Socket();
		socket.username = username;

		Sessions = require('./../../../../src/server/services/sessions');
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		Sessions.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance;

		beforeEach(function () {
			instance = new Sessions();
		});

		it('should be an instance of the Connections class', function () {
			instance.should.be.an.instanceOf(Sessions);
		});

		it('should return the registered session', function () {
			var expectedSession = {
				socket: socket,
				user: user,
				checked: true
			};

			instance.add(socket, user);
			instance.get(username).should.eql(expectedSession);
		});

		it('should fail silently when removing an unauthenticated socket', function () {
			delete socket.username;
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
				socket.username = username;
				instance.add(socket, user);
				sessions[username] = {
					socket: socket,
					user: user,
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
				.and.calledThrice;
		});
	});
});