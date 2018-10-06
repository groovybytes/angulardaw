var express = require('express');
var serveIndex = require('serve-index');
var cors = require('cors');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use(cors())
express.static('assets')
app.use('/assets', express.static('assets'), serveIndex('assets', {'icons': true}))

app.listen(9000, function () {
  console.log('Example app listening on port 9000!');
});
