var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:title', function(req, res, next) {
    res.render('campsites', {
        title: req.params.title,
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs'}
    });
});

module.exports = router;
