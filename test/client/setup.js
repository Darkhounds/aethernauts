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

var jsdom = require('jsdom');
var document = jsdom.jsdom('<!doctype html><html><body id="APP"></body></html>');
var window = document.defaultView;

global.window = window;
global.history = {
	replaceState: function () {}
};
global.document = document;

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

// var websocket = function (url, protocols) {
// 	this.protocol = (typeof protocols === 'string') ? protocols : protocols[0];
// 	this.url = url;
// 	this.readyState = true;
// 	this.binaryType = 'blob';
//
// 	websocket._registerInstance(this);
// };
// websocket._registerInstance = function (instance) {
// 	websocket.instance = instance;
// };
// websocket.CONNECTING = 0;
// websocket.OPEN = 1;
// websocket.CLOSING = 2;
// websocket.CLOSED = 3;
// websocket.prototype.send = function () {};
// websocket.prototype.close = function () {};
// window.WebSocket = websocket;

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);