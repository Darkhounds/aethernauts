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
var jsdom = require('jsdom');
var document = jsdom.jsdom('<!doctype html><html><body></body></html>');
var window = document.defaultView;
jsdom.changeURL(window, address);

global.window = window;
global.history = {
	replaceState: function () {}
};
global.document = document;

global.setWindowAddress = function (newAddress) {
	jsdom.changeURL(window, newAddress);
};

global.resetWindowAddress = function () {
	jsdom.changeURL(window, address);
};

var simulant = require('simulant');
var readyState = "loading";
function setReadyState(state) {
	if (state != readyState) {
		readyState = state;
		simulant.fire( document, 'readystatechange' );
		if (document.onreadystatechange) {
			document.onreadystatechange();
		}
	}
}
Object.defineProperty(document, "readyState", {
	get: function () { return readyState; },
	set: function (state) { setReadyState(state); }
});

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

WebSocket = require('./mockups/websocket');
window.WebSocket = WebSocket;

