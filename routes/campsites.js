//load some node js modules
var express = require('express');
var router = express();
var request = require('request');

//api keys
var weatherApiKey = '4d30a475c46e1fc7e5c6d9f7ee6517be';
var flickrApiKey = 'd417fc0243e0d8899645e1ff174d67d4';

//time for 2016-01-01
var unixTime = '1451606400';

/* GET home page. */
router.get('/', function(req, res, next) {
    var regrex = /.*\, .* (.*) (\d+)\, \w+/g;
    var suburb = req.query.address;
    var match = regrex.exec(suburb);

    var test_lat = req.query.lat;
    var test_long = req.query.long;

    var placeImages = [];

    var fiveDayWeather = [];

    //api url links
    var weatherApi = 'http://api.openweathermap.org/data/2.5/weather?zip=+' + match[2] +
        ',au&appid=' + weatherApiKey + '&mode=json&units=metric';
    var fiveDayWeatherApi = 'http://api.openweathermap.org/data/2.5/forecast?' +
        'lat=' + test_lat + '&lon=' + test_long + '&appid=' + weatherApiKey + '&units=metric';
    var flickrApi = 'https://api.flickr.com/services/rest/?method=flickr.photos.search' +
        '&api_key=' + flickrApiKey + '&tags=' + match[1] + '&min_upload_date=' + unixTime + '&safe_search=1' +
        '&lat=' + test_lat + '&lon=' + test_long + '&format=json&nojsoncallback=1';


    //might use async package for multiple request
    //http://stackoverflow.com/questions/34436455/calling-multiple-http-requests-in-a-single-http-request-in-node-js

    //debugging statement:
    console.log("the json request url:" + fiveDayWeatherApi);

    request({
        url: fiveDayWeatherApi,
        json: true
    }, function(error, response, weather5) {
        if (!error && response.statusCode == 200) {
            //more debugging
            //console.log(weather5);
            //check length here
            //console.log("length of the array is here: "+weather5.list.length);

            for (i = 3; i < weather5.list.length; i += 8) {

                var day = {
                    time: weather5.list[i].dt_txt,
                    weather: weather5.list[i].weather[0].description,
                    temp: weather5.list[i].main.temp,
                    humidity: weather5.list[i].main.humidity,
                    windSpeed: weather5.list[i].wind.speed
                }
                //console.log("array check :"+ i);
                // fiveDayWeather.push('Date:' + weather5.list[i].dt_txt +
                //     'Weather description:' + weather5.list[i].weather[0].description +
                //     'temp_min:' +
                //     weather5.list[i].main.temp_min + '  temp_max:' +
                //     weather5.list[i].main.temp_max + '  humidity:' +
                //     weather5.list[i].main.humidity + '%  wind speed:' +
                //     weather5.list[i].wind.speed + 'm/s'); // more debugging statements+ '        zzzzzzz:' + weather5.list[i].dt_txt);

                fiveDayWeather.push(day);
            }
        }
    });



    request({
        url: flickrApi,
        json: true
    }, function(error, response, imgs) {
        if (!error && response.statusCode == 200) {
            //console.log(imgs.photos.photo[0]);

            for (i = 0; i < 20; i++) {
                if (i === img.photos.photo.length) {
                    break;
                }

                // placeImages += '<br>https://farm' + imgs.photos.photo[i].farm +
                //     '.staticflickr.com/' + imgs.photos.photo[i].server +
                //     '/' + imgs.photos.photo[i].id + '_' +
                //     imgs.photos.photo[i].secret + '.jpg</br>';
                //
                // placeImages += '<br>https://www.flickr.com/photos/' +
                //     imgs.photos.photo[i].owner + '/' +
                //     imgs.photos.photo[i].id + '</br>';

                var imgUrl =  'https://farm' + imgs.photos.photo[i].farm +
                '.staticflickr.com/' + imgs.photos.photo[i].server +
                '/' + imgs.photos.photo[i].id + '_' +
                imgs.photos.photo[i].secret + '.jpg';
                placeImages.push(imgUrl);
                console.log(imgUrl);
            }

            request({
                url: weatherApi,
                json: true
            }, function(error, response, weather) {
                if (!error && response.statusCode == 200) {
                    res.render('campsites', {
                        //used for google maps
                        place_id: req.query.id,
                        place_name: weather.name,
                        place_condition: weather.weather[0].description,
                        place_temp: weather.main.temp,
                        place_wind_speed: weather.wind.speed,
                        place_5day_weather: fiveDayWeather,
                        place_images: placeImages,
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
