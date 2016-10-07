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
router.get('/', function(req, res, next) {
    /*
    Campsite.findOne({id: req.params.id}, function(err, data) {
        if (err) throw err;
    })*/
    var regrex = /.*\, .* .* (\d+)\, \w+/g;
    var suburb = req.param('address');
    var match = regrex.exec(suburb);

    var weatherapi ='http://api.openweathermap.org/data/2.5/weather?zip=+'+match[1]+',au&appid=4d30a475c46e1fc7e5c6d9f7ee6517be&mode=json';


    res.render('campsites', {
        place_id: req.param('id'),
        place_name: 'something',
        place_min: 1,
        place_max: 2,
        place_wind_speed: 3,
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs', API_KEY: 'partials/api_key'}
    });
});

module.exports = router;
