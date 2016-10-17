// Keep map as a global
var map;
// Create a blank array for all map markers
var markers = [];
var infowindow;
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

    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('value')), {
            types: ['geocode'],
            componentRestrictions: {
                country: 'au'
            }
        }
    )

    // If the user returns to the page with the checkbox already checked, set the listener to be active
    if (document.getElementById('automatic').checked) {
        addAutoListener();
    }

    if (window.location.search) {
        var nearby = getParameterByName('nearby');
        if (nearby) {
            nearSearch();
        } else {
            var place_id = getParameterByName('location');
            var request = {
                placeId: place_id
            };
            var service = new google.maps.places.PlacesService(map);
            service.getDetails(request, callback);

            function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    autocomplete.set("place", place);
                    querySearch();
                }
            }
        }
    }
}

function checkAuto() {
    if (document.getElementById('automatic').checked) {
        addAutoListener();
    } else {
        autoListener.remove();
    }
}

function addAutoListener() {
    autoListener = google.maps.event.addListener(map, 'dragend', function() {
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
    deleteMarkers();
    var place = autocomplete.getPlace();
    // Only search if they have selected a valid google maps place
    if (place.place_id) {
        // console.log(place);
        var pos = place.geometry.location;
        map.setCenter(pos);

        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: "current location"
        })
        infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.adr_address);
            infowindow.setOptions({
                pixelOffset: new google.maps.Size(0, 0)
            })
            infowindow.open(map, marker);
        });

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
    deleteMarkers();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: "current location"
            })
            infowindow = new google.maps.InfoWindow();

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent('Current Location');
                infowindow.setOptions({
                    pixelOffset: new google.maps.Size(0, 0)
                })
                infowindow.open(map, marker);
            });

            map.setCenter(pos);

            var request = {
                location: pos,
                radius: 50000,
                types: ['campground']
            }
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
    if (place.icon != "https://maps.gstatic.com/mapfiles/place_api/icons/camping-71.png") {
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
    service.getDetails({
        placeId: place.place_id
    }, function(placeInfo, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (placeInfo.rating) {
                var rating = placeInfo.rating + " stars";
            } else {
                var rating = "No reviews";
            }
            var place = {
                id: placeInfo.place_id,
                name: placeInfo.name,
                address: placeInfo.formatted_address,
                phone: placeInfo.formatted_phone_number,
                rating: placeInfo.rating,
                distance: distance
            }

            if (placeInfo.photos) {
                place.photo = placeInfo.photos[0].getUrl({'maxWidth': 170, 'maxHeight': 180});
            }

            if (place.photo)
                $("#campsites-list ul").append('<li><div class="row"><div class="col-lg-5 col-md-12 campsite-img-container"><img class="campsite-img" src=' + place.photo + '></div>' +
                    '<div class="col-lg-7 col-md-12"><h3><span class="name">' + place.name + '</span></h3>' + place.address + '<br /><b>Phone:</b> ' +
                    place.phone + '<br /><b>Distance: </b><span class="distance">' + place.distance + '</span><br /><b>Rating: </b><span class="rating">' + place.rating +
                    '</span><br /><a href="/campsites?id=' + place.id +
                    '&address=' + place.address + '&lat=' + lat + '&long=' + lng +
                    '"><button class="btn btn-default" type="button">View More</button></a></div></div></li><br />');
            // console.log(name + " " + address);
        } else if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            // console.log("ran out of juice guys");
        }
    });
    // console.log(place, distance);

    google.maps.event.addListener(marker, 'click', function() {
        var apicall = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true';

        $.getJSON(apicall, function(data) {
            var placeDetails = {
                id: place.place_id,
                name: place.name,
                address: place.formatted_address,
                phone: place.formatted_phone_number,
                rating: place.rating,
            }

            if (place.photos) {
                placeDetails.photo = place.photos[0].getUrl({'maxWidth': 160});
            }

            console.log(placeDetails.photo)

            if (placeDetails.photo) {
                infowindow.setContent('<div><img class="campsite-img-thumbnail" src=' + placeDetails.photo + '><a href="/campsites?id=' + placeDetails.id +
                                    '&address=' + data.results[0].formatted_address +
                                    '&lat=' + lat + '&long=' + lng + '"><b><h5>' + place.name + '<h5></a></b></div>');
            } else {
                infowindow.setContent('<div><a href="/campsites?id=' + placeDetails.id + '&address=' + data.results[0].formatted_address +
                                    '&lat=' + lat + '&long=' + lng + '"><b>' + placeDetails.name + '</a></b></div>');
            }

        });

        infowindow.setOptions({
            pixelOffset: new google.maps.Size(-25, 0)
        })
        infowindow.open(map, marker);
    });
}

function sortList() {
    var sortValue = document.getElementById('sort-option').value;
    console.log(sortValue);
    $('li').sortElements(function(a, b) {
        return $(a).find('.name').text() > $(b).find('.name').text() ? 1 : -1;
    })
}

function updateLocation() {
    if (autocomplete.getPlace().place_id) {
        var val = document.getElementById('value').value;
        document.location.href = "?location=" + autocomplete.getPlace().place_id;
    }
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
