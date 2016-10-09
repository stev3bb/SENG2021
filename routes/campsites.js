//load some node js modules
var express = require('express');
var router = express();
var request = require('request');

//api keys
var weatherapikey = '4d30a475c46e1fc7e5c6d9f7ee6517be';
var flickrapikey = 'd417fc0243e0d8899645e1ff174d67d4';

//time for 2016-01-01
var unixtime = '1451606400';

/* GET home page. */
router.get('/', function(req, res, next) {
    var regrex = /.*\, .* (.*) (\d+)\, \w+/g;
    var suburb = req.param('address');
    var match = regrex.exec(suburb);

    var test_lat = req.param('lat');
    var test_long = req.param('long');

    var placeImages = [];

    var fivedayweather = [];

    //api url links
    var weatherapi = 'http://api.openweathermap.org/data/2.5/weather?zip=+' + match[2] 
    + ',au&appid=' + weatherapikey + '&mode=json&units=metric';
    var weather5api = 'http://api.openweathermap.org/data/2.5/forecast?'
    +'lat='+ test_lat +'&lon='+ test_long +'&appid='+ weatherapikey +'&units=metric';





    var flickrapi = 'https://api.flickr.com/services/rest/?method=flickr.photos.search' +
        '&api_key=' + flickrapikey + '&tags=' + match[1] + '&min_upload_date=' + unixtime + '&safe_search=1' +
        '&lat=' + test_lat + '&lon=' + test_long + '&format=json&nojsoncallback=1';


    //might use async package for multiple request
    //http://stackoverflow.com/questions/34436455/calling-multiple-http-requests-in-a-single-http-request-in-node-js

    //debugging statement:
    console.log("the json request url:" + weather5api);

    request({
        url: weather5api,
        json: true
    }, function(error, response, weather5) {
        if (!error && response.statusCode == 200) {
            //more debugging
            //console.log(weather5);
            //check length here
            //console.log("length of the array is here: "+weather5.list.length);

            for (i = 0, requestlength = weather5.list.length ; i<requestlength; i+=8){


                //console.log("array check :"+ i);
                fivedayweather.push('array no.' + i  
                    + '  weather description:'+ weather5.list[i].weather[0].description
                    +'  temp_min:' 
                    + weather5.list[i].main.temp_min +  '  temp_max:'
                    + weather5.list[i].main.temp_max + '  humidity:'
                    + weather5.list[i].main.humidity + '  wind speed:'
                    + weather5.list[i].wind.speed); // more debugging statements+ '        zzzzzzz:' + weather5.list[i].dt_txt);
            }
        }
    });



    request({
        url: flickrapi,
        json: true
    }, function(error, response, imgs) {
        if (!error && response.statusCode == 200) {
            //console.log(imgs.photos.photo[0]);

            for (i = 0; i < 20; i++) {

                // placeImages += '<br>https://farm' + imgs.photos.photo[i].farm +
                //     '.staticflickr.com/' + imgs.photos.photo[i].server +
                //     '/' + imgs.photos.photo[i].id + '_' +
                //     imgs.photos.photo[i].secret + '.jpg</br>';
                //
                // placeImages += '<br>https://www.flickr.com/photos/' +
                //     imgs.photos.photo[i].owner + '/' +
                //     imgs.photos.photo[i].id + '</br>';

                var imgUrl = 'https://www.flickr.com/photos/' + imgs.photos.photo[i].owner + '/' + imgs.photos.photo[i].id;
                placeImages.push(imgUrl);
                console.log(imgUrl);
            }

            request({
                url: weatherapi,
                json: true
            }, function(error, response, weather) {
                if (!error && response.statusCode == 200) {
                    console.log("Everything works");
                    res.render('campsites', {
                        //used for google maps
                        place_id: req.param('id'),
                        place_name: weather.name,
                        place_condition: weather.weather[0].description,
                        place_min: weather.main.temp_min,
                        place_max: weather.main.temp_max,
                        place_wind_speed: weather.wind.speed,
                        place_5day_weather: fivedayweather,
                        placeImages: placeImages,
                        partials: {
                            header: 'partials/header',
                            navbar: 'partials/navbar',
                            bottomJs: 'partials/bottomJs',
                            API_KEY: 'partials/api_key'
                        }
                    });
                } else {
                    console.log("Nothing works");
                }
            });
        }
    });
});


module.exports = router;
