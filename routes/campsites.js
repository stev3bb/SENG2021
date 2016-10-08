//load some node js modules
var express = require('express');
var router = express();
var request = require('request');

//api keys 
var weatherapikey = '4d30a475c46e1fc7e5c6d9f7ee6517be';
var flickrapikey = 'd417fc0243e0d8899645e1ff174d67d4';

//time
var unixtime = '1451606400';
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
    var regrex = /.*\, .* (.*) (\d+)\, \w+/g;
    var suburb = req.param('address');
    var match = regrex.exec(suburb);

    var test_lat = req.param('lat');
    var test_long = req.param('long');

    var arrpics ='';


    //api url licks
    var weatherapi ='http://api.openweathermap.org/data/2.5/weather?zip=+'+match[2]+',au&appid='+weatherapikey+'&mode=json&units=metric';

    /****
    ****/
    var flickrapi ='https://api.flickr.com/services/rest/?method=flickr.photos.search'+
    '&api_key='+flickrapikey+'&tags='+match[1]+'&min_upload_date='+unixtime+'&safe_search=1'+
    '&lat='+test_lat+'&lon='+test_long+'&format=json&nojsoncallback=1';

    request(
        {   url: flickrapi,
            json: true
        }, function (error, response, imgs) {
        if (!error && response.statusCode == 200) {
            //console.log(imgs.photos.photo[0]);

            for (i = 1, len=imgs.photos.photo.length; i<len; i++){
                
                arrpics+='<br>https://farm'+imgs.photos.photo[i].farm
                +'.staticflickr.com/'+imgs.photos.photo[i].server
                +'/'+imgs.photos.photo[i].id+'_'
                +imgs.photos.photo[i].secret+'.jpg</br>';

               // arrpics+='<br>https://www.flickr.com/photos/'
               // +imgs.photos.photo[i].owner+'/'
                //+imgs.photos.photo[i].id+'</br>';
              //console.log('https://www.flickr.com/photos/'+imgs.photos.photo[i].owner+'/'+imgs.photos.photo[i].id);

            }

        }
    });

    console.log(arrpics);

    request(
        {   url: weatherapi,
            json: true
        }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) 
            res.render('campsites', {
                //used for google maps
                place_id: req.param('id'),
                place_name: body.name,
                place_condition: body.weather[0].description,
                place_min: body.main.temp_min,
                place_max: body.main.temp_max,
                place_wind_speed: body.wind.speed,
                place_pic: arrpics,
                partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs', API_KEY: 'partials/api_key'}
            });     
        }else{
            //render something else 
        }
    })

    
});


module.exports = router;
