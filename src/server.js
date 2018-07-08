var http = require('http')
var express = require('express')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var errorHandler = require('errorhandler');
var serveIndex = require('serve-index');
var cors=require("cors");
var app = express();
var router = express.Router();
var samplesApi = require('./server/samples.api');

app.set('port', process.env.PORT || 3000)
app.use(cors());
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use("/assets",express.static(path.join(__dirname, 'assets')))
app.use('/api/sounds/', express.static('assets/sounds'), serveIndex('assets/sounds', {'icons': true}))
app.use('/api/files', require('./server/files.api'));
app.use(errorHandler())


var server = http.createServer(app)
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
