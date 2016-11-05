describe('The Empty View class', function () {
	var EmptyView;

	beforeEach(function () {
		EmptyView = require('./../../../../../src/client/js/view/notification/empty-view');
	});

	it('should be a function', function () {
		EmptyView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, context;

		beforeEach(function () {
			context = document.createElement('div');
			context.id = 'NOTIFICATION';
			instance = new EmptyView();
		});

		it('should be an instance of the EmptyView class', function () {
			instance.should.be.an.instanceOf(EmptyView);
		});

		it('should clear the context innerHTML while rendering', function () {
			context.innerHTML = '<span>Bogus</span>';

			instance.render(context);

			context.innerHTML.should.equal('');
		});

		it('should add the "hidden" class to the context', function () {
			instance.render(context);

			context.classList.contains('hidden').should.be.true;
		});
	});
});