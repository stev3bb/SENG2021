var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://seng:seng@ds035846.mlab.com:35846/seng2021');

var campsiteSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    phone: String,
    rating: String
});

var Campsite = mongoose.model('Campsite', campsiteSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('campsearch', {
        title: 'Campsite Search',
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs', API_KEY: 'partials/api_key'},
        qs: req.query
    });
});

module.exports = router;
