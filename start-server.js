var StaticsController = require('./src/server/controller/statics-controller');
var staticsController = new StaticsController(__dirname + '/public/', 3001);
staticsController.connect();

var WebsocketController = require('./src/server/controller/websocket-controller');
var websocketController = new WebsocketController(3002);
websocketController.connect();
