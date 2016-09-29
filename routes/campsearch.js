var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('campsearch', {
        title: 'Campsite Search',
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs', API_KEY: 'partials/api_key'},
        qs: req.query
    });
});

module.exports = router;
