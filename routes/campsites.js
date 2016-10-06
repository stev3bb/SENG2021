var express = require('express');
var router = express();


/*
var mongoose = require('mongoose');

mongoose.connect('mongodb://seng:seng@ds035846.mlab.com:35846/seng2021');

var campsiteSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String
});

var Campsite = mongoose.model('Campsite', campsiteSchema);
*/



/* GET home page. */
router.get('/site', function(req, res, next) {
    /*
    Campsite.findOne({id: req.params.id}, function(err, data) {
        if (err) throw err;
    })*/
    res.render('campsites', {
        place_id: req.query.id,
        place_name: req.query.city,

        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs', API_KEY: 'partials/api_key'}
    });
});

module.exports = router;
