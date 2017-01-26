var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('graphmarks/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
