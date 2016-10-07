var express = require('express');
var router = express();
var request = require('request');

//url links 

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
        /*request('google.com.au', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Show the HTML for the Google homepage. 
            }
        })*/

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


        /*
        //used for google maps
        place_id: req.param('id'),
        place_name: 1,
        place_condition: 2,
        place_min: 3,
        place_max: 4,
        place_wind_speed: 5,
        */
 
});

module.exports = router;
