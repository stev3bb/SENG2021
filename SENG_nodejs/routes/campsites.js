var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:title', function(req, res, next) {
  res.render('campsites', { title: req.params.title });
});

module.exports = router;
