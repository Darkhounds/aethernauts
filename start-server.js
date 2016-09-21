var StaticsController = require('./src/server/controller/statics-controller');
var staticsController = new StaticsController(__dirname + '/public/', 3001);
staticsController.connect();