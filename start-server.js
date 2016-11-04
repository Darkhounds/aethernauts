var MainController = require('./src/server/controller/main-controller');

var controller = new MainController();
controller.initialize(3001, __dirname);
controller.connect();