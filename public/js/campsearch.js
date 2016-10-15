
//need to go through this tomorrow to debug

// Keep map as a global
var map;
// Create a blank array for all map markers
var markers = [];
var infowindow;
var init = 0;


/*initialise map

summary:
- add event listener- drag
- records the center of the map, and uses it to use place services
- repaint the markers and refresh the map
*/

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.8688,
            lng: 151.2093
        },
        mapTypeControl: false,
        zoom: 10
    });
    //var directionsDisplay = new google.maps.DirectionsRenderer;
    //var directionsService = new google.maps.DirectionsService;

    google.maps.event.addListener(map, 'dragend', function() {

        //clear markers here
        deleteMarkers();

        // Empty the list of campsites
        $('#campsites-list ul').empty();

        var request = {
            location: map.getCenter(),
            //max range
            radius: 50000,
            types: ['campground']
        }

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    //console.log(results[i]);
                    createMarker(results[i]);
                }
            }
        });
    });

    if (window.location.search && init === 0) {
        var nearby = getParameterByName('nearby');
        init = 1;
        if (nearby === 'true') {
            nearSearch();
        } else {
            querySearch();
        }
    }
}


//***************************************************

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

//***************************************************

// Searching using a given address
function querySearch() {
    var newlatlong = [];
    //search functionality goes here
    var searchval = document.getElementById('value').value;
    //some variables
    var service;
    var marker;
    var pos;
    var mapOptions = {
        zoom: 10,
        mapTypeControl: false
    };
    //auto complete object
    var autocomplete;
    //australia region bounds
    var country = {
        center: {
            lat: -25.3,
            lng: 133.8
        },
        zoom: 4
    };

    if (searchval) {
        //make new map here
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var geocoder = new google.maps.Geocoder();
        var service = new google.maps.places.AutocompleteService(null, {types: ['geocode']});

        service.getPlacePredictions({input: searchval}, function(predictions, status) {
            if (status == 'OK') {
                var i = 1;
                if (predictions[i]) {
                    (function(i) {
                        //var n = document.getElementById('results')
                        //.appendChild(document.createElement('li')),
                        var s = new google.maps.places.PlacesService(map);
                        var p = predictions[i].description;

                        s.getDetails({reference: predictions[i].reference}, function(details, status) {
                            //n.appendChild(document.createTextNode(p));
                            //n.appendChild(document.createElement('br'));
                            //n.appendChild(document.createTextNode(
                            //details.geometry.location.toString()));

                            // console.log(details.geometry.location.toString());

                            //more repeated code:
                            pos = details.geometry.location;

                            var marker = new google.maps.Marker({
                                position: pos,
                                map: map,
                                title: "current location"
                            });

                            map.setCenter(pos);

                            var request = {
                                location: pos,
                                radius: 50000,
                                types: ['campground']
                            };

                            infowindow = new google.maps.InfoWindow();
                            var service = new google.maps.places.PlacesService(map);
                            service.nearbySearch(request, function(results, status) {
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    for (var i = 0; i < results.length; i++) {
                                        //console.log(results[i]);
                                        createMarker(results[i]);
                                    }
                                }
                            });
                        });
                    })(i)
                }
            }
        });
    }
}

function nearSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            /*infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'My current location'
        });*/
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: "current location"
            })

            map.setCenter(pos);

            var request = {
                location: pos,
                radius: 50000,
                types: ['campground']
            }
            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        //console.log(results[i]);
                        createMarker(results[i]);
                    }
                }
            });
        }, function() {});
    } else {
        return;
    }
}

function createMarker(place) {
    var location = place.geometry.location;
    var locString = location.toString();
    var regrex = /(\-.+)\, (.+)\)/g;
    var match = regrex.exec(locString);
    //console.log("bad stuff is happening:"+ place.address);

    var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 34),
        scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        position: location
    });

    markers.push(marker);

    var distance = google.maps.geometry.spherical.computeDistanceBetween(location, map.getCenter());
    distance = Math.round(distance / 1000);

    var service = new google.maps.places.PlacesService(map);
    service.getDetails({placeId: place.place_id}, function(placeInfo, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (placeInfo.rating) {
                var rating = placeInfo.rating + " stars";
            } else {
                var rating = "No reviews";
            }
            var id = placeInfo.place_id;
            var name = placeInfo.name;
            var address = placeInfo.formatted_address;
            var phone = placeInfo.formatted_phone_number;

            console.log(placeInfo);
            if (placeInfo.photos) var photo = placeInfo.photos[0].getUrl({'maxWidth': 170, 'maxHeight': 180});

            if (photo)
            $("#campsites-list ul").append('<li><div class="row"><div class="col-md-4 campsite-img-container"><img class="campsite-img" src=' + photo + '></div>' +
            '<div class="col-md-8"><h3>' + name + '</h3>' + address + '<br /><b>Phone:</b> ' +
                phone + '<br /><b>Distance:</b> ' + distance +
                'km<br /><a href="/campsites?id=' + id +
                '&address=' + address + '&lat='+ match[1] + '&long=' + match[2]
                +'"><button class="btn btn-default" type="button">View More</button></a></li><br /></div></div>');
            // console.log(name + " " + address);
        } else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            // console.log("ran out of juice guys");
        }
    });
    // console.log(place, distance);

    google.maps.event.addListener(marker, 'click', function() {
        // var placeR;
        // if (place.rating == undefined){
        //     placeR = "(no rating)";
        // }else{
        //     placeR = place.rating + ' stars';
        // }

        //var locString = location.toString();
        //var regrex = /(\-.+)\, (.+)\)/g;
        //var match = regrex.exec(locString);
        var apicall = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+match[1]+','+match[2]+'&sensor=true';


        //console.log("something is broken" + place_address);


        $.getJSON(apicall, function (data) {
            infowindow.setContent('<div><a href="/campsites?id=' + place.place_id + '&address='+ data.results[0].formatted_address
                +'&lat='+match[1]+'&long='+match[2]+'"><b>' + place.name + '</a></b></div>' +
            '<li><a href = https://www.google.com/maps/dir/Current+Location/' + match[1] + ',' + match[2] + ' target="_blank">Direction</a></li>');
        });


        //infowindow.setContent('<div><a href="/campsites?id=' + place.place_id + '&address='+ address +'"><b>' + place.name + '</a></b></div>' +
          //  '<li><a href = https://www.google.com/maps/dir/Current+Location/' + match[1] + ',' + match[2] + ' target="_blank">Direction</a></li>');
        infowindow.setOptions({pixelOffset: new google.maps.Size(-25, 0)})
        infowindow.open(map, marker);
    });
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
