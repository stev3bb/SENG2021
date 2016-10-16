
// Keep map as a global
var map;
// Create a blank array for all map markers
var markers = [];
var infowindow;
var init = 0;
var autoListener;
var autocomplete;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.8688,
            lng: 151.2093
        },
        mapTypeControl: false,
        zoom: 10
    });

    // TESTING PLACES SEARCH BOX
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('value')), {
            types: ['geocode']
        }
    )

    // If the user returns to the page with the checkbox already checked, set the listener to be active
    if (document.getElementById('automatic').checked) {
        console.log("Checked");
        addAutoListener();
    }

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

function checkAuto() {
    if(document.getElementById('automatic').checked) {
        addAutoListener();
    } else {
        autoListener.remove();
    }
}

function addAutoListener() {
    autoListener = google.maps.event.addListener(map, 'dragend', function() {

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
    var place = autocomplete.getPlace();
    // Only search if they have selected a valid google maps place
    if (place) {
        var pos = place.geometry.location;
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
    }
}

function nearSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
                
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
    //for debugging only here
    console.log(JSON.parse(JSON.stringify(place)));
    if (place.icon != "https://maps.gstatic.com/mapfiles/place_api/icons/camping-71.png"){
        return;
    }


    var location = place.geometry.location;
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();

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
    //console.log(placeInfo.reviews);
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

            //console.log(placeInfo);
            if (placeInfo.photos) var photo = placeInfo.photos[0].getUrl({'maxWidth': 170, 'maxHeight': 180});

            if (photo)
            $("#campsites-list ul").append('<li><div class="row"><div class="col-lg-5 col-md-12 campsite-img-container"><img class="campsite-img" src=' + photo + '></div>' +
            '<div class="col-lg-7 col-md-12"><h3>' + name + '</h3>' + address + '<br /><b>Phone:</b> ' +
                phone + '<br /><b>Distance:</b> ' + distance +
                'km<br /><a href="/campsites?id=' + id +
                '&address=' + address + '&lat='+ lat + '&long=' + lng +
                '"><button class="btn btn-default" type="button">View More</button></a></div></div></li><br />');
            // console.log(name + " " + address);
        } else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            // console.log("ran out of juice guys");
        }
    });
    // console.log(place, distance);

    google.maps.event.addListener(marker, 'click', function() {
        var apicall = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat +','+ lng +'&sensor=true';

        $.getJSON(apicall, function (data) {
            infowindow.setContent('<div><a href="/campsites?id=' + place.place_id + '&address='+ data.results[0].formatted_address
                +'&lat='+ lat +'&long='+ lng +'"><b>' + place.name + '</a></b></div>' +
            '<li><a href = https://www.google.com/maps/dir/Current+Location/' + lat + ',' + lng + ' target="_blank">Direction</a></li>');
        });

        infowindow.setOptions({pixelOffset: new google.maps.Size(-25, 0)})
        infowindow.open(map, marker);
    });
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
