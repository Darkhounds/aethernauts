var MainController = require('./src/server/controllers/main-controller');

var controller = new MainController(3001, __dirname);
controller.connect();