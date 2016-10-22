var wrongCredentialsTemplate = require('./../../../../../src/client/html/notification/wrong-credentials.html');

describe('The Wrong Credentials View class', function () {
	var WrongCredentialsView;

	beforeEach(function () {
		WrongCredentialsView = require('./../../../../../src/client/js/view/notification/wrong-credentials-view');
	});

	it('should be a function', function () {
		WrongCredentialsView.should.be.a('function');
	});

	describe('as an instance', function () {
		var instance, context;

		beforeEach(function () {
			context = document.createElement('div');
			context.id = 'NOTIFICATION';
			instance = new WrongCredentialsView();
		});

		it('should be an instance of the WrongCredentialsView class', function () {
			instance.should.be.an.instanceOf(WrongCredentialsView);
		});

		it('should set the context innerHTML to the wrongCredentialsTemplate while rendering', function () {
			context.innerHTML = '<span>Bogus</span>';

			instance.render(context);

			context.innerHTML.should.equal(wrongCredentialsTemplate);
		});

		it('should remove the "hidden" class from the context when rendering', function () {
			context.classList.add('hidden');

			instance.render(context);

			context.classList.contains('hidden').should.be.false;
		});
	});
});