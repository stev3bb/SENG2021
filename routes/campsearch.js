var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('campsearch', {
        title: 'Campsite Search',
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs'},
        qs: req.query
    });
});

module.exports = router;
