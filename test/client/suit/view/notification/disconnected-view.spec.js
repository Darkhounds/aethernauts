var disconnectedTemplate = require('./../../../../../src/client/html/notification/disconnected.html');

describe('The Disconnected View class', function () {
	var DisconnectedView;

	beforeEach(function () {
		DisconnectedView = require('./../../../../../src/client/js/view/notification/disconnected-view');
	});

	it('should be a function', function () {
		DisconnectedView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, context;

		beforeEach(function () {
			context = document.createElement('div');
			context.id = 'NOTIFICATION';
			instance = new DisconnectedView();
		});

		it('should be an instance of the DisconnectedView class', function () {
			instance.should.be.an.instanceOf(DisconnectedView);
		});

		it('should set the context innerHTML to the disconnectedTemplate while rendering', function () {
			context.innerHTML = '<span>Bogus</span>';

			instance.render(context);

			context.innerHTML.should.equal(disconnectedTemplate);
		});

		it('should add the "hidden" class to the context', function () {
			context.classList.add('hidden');

			instance.render(context);

			context.classList.contains('hidden').should.be.false;
		});
	});
});