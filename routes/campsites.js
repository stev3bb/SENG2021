var express = require('express');
var router = express();
var request = require('request');
var file = '/api_key.txt';

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



const IMAGES_ON = true;

// API keys
var weatherApiKey = '4d30a475c46e1fc7e5c6d9f7ee6517be';
var flickrApiKey = 'd417fc0243e0d8899645e1ff174d67d4';
var mapsApiKey = 'AIzaSyDydgd2jbeRErhSowqagqkqVqARAPUieAw';


var placeImages = [];

function getWeather(req, res, next) {
    var lat = req.query.lat;
    var lng = req.query.long;
    var fiveDayWeatherApi = 'http://api.openweathermap.org/data/2.5/forecast?' +
        'lat=' + lat + '&lon=' + lng + '&appid=' + weatherApiKey + '&units=metric';
    request({
        url: fiveDayWeatherApi,
        json: true
    }, function(error, response, weather5) {
        if (!error && response.statusCode == 200) {

            var fiveDayWeather = [];
            for (i = 3; i < weather5.list.length; i += 8) {
                //2016-10-11 12:00:00
                // sets the day of the week from a number returned by getday function
                var weekday = new Array(7);
                weekday[0]=  "Sun";
                weekday[1] = "Mon";
                weekday[2] = "Tue";
                weekday[3] = "Wed";
                weekday[4] = "Thu";
                weekday[5] = "Fri";
                weekday[6] = "Sat";

                //obtaining day from time retrieved from weather api
                var t = weather5.list[i].dt_txt;
                //var t = new Date();
                var day = weekday[new Date(t).getDay()];
                //fixing icon from night to all day
                var oldicon = weather5.list[i].weather[0].icon;
                oldicon = oldicon.replace("n","d");
                var date = {
                    time: day,
                    weather: weather5.list[i].weather[0].description,
                    temp: Math.round(weather5.list[i].main.temp),
                    humidity: weather5.list[i].main.humidity,
                    windSpeed: weather5.list[i].wind.speed,
                    icon: oldicon,
                }
                fiveDayWeather.push(date);
            }
            req.fiveDayWeather = fiveDayWeather;
        }
        next();
    });
}

function getPlaceDetails(req, res, next) {
    var lat = req.query.lat;
    var lng = req.query.long;
    var mapsApi = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.query.id + '&key=' + mapsApiKey;

    request({
        url: mapsApi,
        json: true
    }, function(error, response, place) {
        if (!error && response.statusCode == 200) {
            var placeDetails = {};

            placeDetails.name = place.result.name;

            placeDetails.address = place.result.formatted_address;
            if (place.result.formatted_phone_number)
                placeDetails.phone = place.result.formatted_phone_number;
            else
                placeDetails.phone = "N/A";
            if (place.result.opening_hours)
                placeDetails.openingHours = place.result.opening_hours.weekday_text;
            if (place.result.rating)
                placeDetails.rating = (Math.round(place.result.rating*2)/2)*20;
            else
                placeDetails.rating = 0;
            if (place.result.website)
                placeDetails.website = place.result.website;
            else
                placeDetails.website = "N/A";

            if (!IMAGES_ON) {
                req.placeDetails = placeDetails;
                next();
                return;
            }

            if (place.result.photos) {
                for (var i = 0; i < place.result.photos.length; i++) {
                    var photoRef = place.result.photos[i].photo_reference;
                    var height = place.result.photos[i].height;
                    placeImages.push("https://maps.googleapis.com/maps/api/place/photo?" +
                    "photoreference=" + photoRef + "&maxheight=" + height +
                    "&key=" + mapsApiKey);
                }
            }
            req.placeDetails = placeDetails;
        }
        next();
    });
}

function checkFlickrImages(req, res, next) {
    var lat = req.query.lat;
    var lng = req.query.long;
    var flickrApi = 'https://api.flickr.com/services/rest/?method=flickr.photos.search' +
        '&api_key=' + flickrApiKey + '&sort=interestingness-desc' + '&safe_search=1' +
        '&media=photos&lat=' + lat + '&lon=' + lng + '&radius=1&format=json&nojsoncallback=1';

    if (!IMAGES_ON) {
        next();
        return;
    }

    if (placeImages.length) {
        // console.log("Ignoring flickr");
        req.placeImages = placeImages;
        next();
    } else {
        request({
            url: flickrApi,
            json: true
        }, function(error, response, imgs) {
            if (!error && response.statusCode == 200) {
                //console.log(imgs.photos.photo[0]);
                // console.log("Using flickr");
                if (imgs.photos.photo.length != 0){
                    for (i = 0; i < 20; i++) {
                        if (i === imgs.photos.photo.length) {
                            break;
                        }

                        var imgUrl =  'https://farm' + imgs.photos.photo[i].farm +
                        '.staticflickr.com/' + imgs.photos.photo[i].server +
                        '/' + imgs.photos.photo[i].id + '_' +
                        imgs.photos.photo[i].secret + '.jpg';
                        placeImages.push(imgUrl);
                        console.log("[" + i + "]: " + placeImages[i]);
                    }
                } else {
                    //or else internet meme
                    placeImages.push('https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSVWU-oMzxvDFu35Ky6uWAn63fqbu2DagpEBtOnFPkC6RAa30wmSg');
                }
            }
            req.placeImages = placeImages;
            next();
        });
    }
}

function renderPage(req, res) {
    if (!IMAGES_ON) {
        res.render('campsites', {
            //used for google maps
            place: req.placeDetails,
            place_5day_weather: req.fiveDayWeather,
            // Take out images if they're not on
            header_image: 0,
            place_images: 0,
            place_lat: req.query.lat,
            place_lng: req.query.long,
            place_id: req.query.id,
            //place_chance: weather.precipitation.value,
            partials: {
                header: 'partials/header',
                navbar: 'partials/navbar',
                bottomJs: 'partials/bottomJs',
                API_KEY: 'partials/api_key'
            }
        });
    }

    res.render('campsites', {
        //used for google maps
        place: req.placeDetails,
        place_5day_weather: req.fiveDayWeather,
        header_image: req.placeImages[0],
        place_images: req.placeImages,
        place_lat: req.query.lat,
        place_lng: req.query.long,
        place_id: req.query.id,
        //place_chance: weather.precipitation.value,
        partials: {
            header: 'partials/header',
            navbar: 'partials/navbar',
            bottomJs: 'partials/bottomJs',
            API_KEY: 'partials/api_key'
        }
    });
}

router.get('/', getWeather, getPlaceDetails, checkFlickrImages, renderPage);
module.exports = router;
