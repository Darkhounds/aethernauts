var wrongCredentialsTemplate = require('./../../../html/notification/wrong-credentials.html');

var Constructor = function () {};

Constructor.prototype.render = function (context) {
	context.innerHTML = wrongCredentialsTemplate;
	context.classList.remove('hidden');
};

module.exports = Constructor;