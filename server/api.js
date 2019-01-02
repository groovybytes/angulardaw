const express = require('express');
const router = express.Router();
const fs=require("fs");


router.post('/save', function (req, res) {
  fs.writeFile(__dirname + "/assets/projects/" + req.body.project.id + ".json", JSON.stringify(req.body.project), function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({success: false, error: err});
    }
    res.send({success: true});
  });
});

router.post('/log', function (req, res) {
  console.log(req.body);
  res.end();
});

router.get('/get', function (req, res) {
  fs.readFile(__dirname + "/assets/projects/" + req.param('id') + ".json", 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send({success: false, error: err});
    }
    res.send({success: true, data: JSON.parse(data)});
  });
});

router.get('/all', function (req, res) {
  fs.readdir(__dirname + "/assets/projects/", (err, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send({success: false, error: err});
    }
    res.send({success: true, data: files.map(file => ({id: file.split(".")[0]}))});
  });
});

module.exports = router;
