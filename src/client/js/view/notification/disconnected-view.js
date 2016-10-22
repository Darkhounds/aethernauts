var disconnectedTemplate = require('./../../../html/notification/disconnected.html');

var Constructor = function () {};

Constructor.prototype.render = function (context) {
	context.innerHTML = disconnectedTemplate;
	context.classList.remove('hidden');
};

module.exports = Constructor;