var stringify = require('stringify');
stringify.registerWithRequire({
	extensions: ['.txt', '.html'],
	minify: true,
	minifyAppliesTo: {
		includeExtensions: ['.html']
	},
	minifyOptions: {
		// html-minifier options
	}
});

var address = 'http://localhost';
var abab = require('abab');
var jsdom = require('jsdom');
var document = jsdom.jsdom('<!doctype html><html><body></body></html>');
var window = document.defaultView;

window.btoa = abab.btoa;
window.atob = abab.atob;

global.btoa = abab.btoa;
global.atob = abab.atob;

jsdom.changeURL(window, address);

global.window = window;
global.history = {
	replaceState: function () {}
};
global.document = document;

Object.defineProperty(document, "readyState", {
	writable: true,
	value: 'complete',
	enumerable: true,
	configurable: true
});

global.setWindowAddress = function (newAddress) {
	jsdom.changeURL(window, newAddress);
};

global.resetWindowAddress = function () {
	jsdom.changeURL(window, address);
};



var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);
