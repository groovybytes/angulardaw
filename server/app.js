var express = require('express');
var serveIndex = require('serve-index');
var cors = require('cors');
var bodyParser = require('body-parser')
var fs = require('fs');

var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use(bodyParser.json())
app.use(cors())
express.static('assets')
app.use('/assets', express.static('assets'), serveIndex('assets', {'icons': true}))

app.post('/api/save', function(req, res) {
  fs.writeFile(__dirname+"/assets/projects/"+req.body.project.id+".json", JSON.stringify(req.body.project), function(err) {
    if(err) {
      console.log(err);
      return res.status(500).send({success:false,error:err});
    }
    res.send({success:true});
  });
});

app.get('/api/get', function(req, res) {
  fs.readFile(__dirname+"/assets/projects/"+req.param('id')+".json", 'utf8', function(err, data) {
    if(err) {
      console.log(err);
      return res.status(500).send({success:false,error:err});
    }
    res.send({success:true,data:JSON.parse(data)});
  });
});

app.get('/api/all', function(req, res) {
  fs.readdir(__dirname+"/assets/projects/", (err, files) => {
    if(err) {
      console.log(err);
      return res.status(500).send({success:false,error:err});
    }
    res.send({success:true,data:files.map(file=>({id:file.split(".")[0]}))});
  })
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!');
});
