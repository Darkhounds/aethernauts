var MainController = require('./controller/main-controller');
var mainController = new MainController();
var querystring = require('querystring');
var params = querystring.decode(window.location.search.substr(1));

mainController.setup(params.serverAddress, params.serverPort, params.serverPath);
