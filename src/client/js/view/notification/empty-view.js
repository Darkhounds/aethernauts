var Constructor = function () {};

Constructor.prototype.render = function (context) {
	context.innerHTML = '';
	context.classList.add('hidden');
};

module.exports = Constructor;