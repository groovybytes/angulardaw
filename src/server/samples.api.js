var express = require('express')
  , router = express.Router();

// Domestic animals page
router.get('/domestic', function(req, res,next) {
  console.log(new Date(), req.method, req.url);
  next();

  /*res.sendFile(__dirname+"assets/icon.png");*/

})

// Wild animals page
router.get('/wild', function(req, res) {
  res.send('Wolf, Fox, Eagle')
})

module.exports = router;

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}
