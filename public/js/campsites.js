//global vars here
var infowindow;
var map;
var mapLatLng = {
    lat: Number(getParameterByName("lat")),
    lng: Number(getParameterByName("long"))
};

//different array of markers
var meds = [];
var shops = [];
var petrol = [];

//google services kept global
var service;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapLatLng,
        zoom: 13,
        mapTypeControl: false
    });

    console.log(mapLatLng);

    var marker = new google.maps.Marker({
        position: mapLatLng,
        map: map,
    });


    //some request here
    var requests = [];

    var medsRequest = {
        location: map.getCenter(),
        //max range
        radius: 5000,
        types: ['hospital']
    }

    var shopsRequest = {
        location: map.getCenter(),
        radius: 5000,
        types: ['grocery_or_supermarket']
    }

    var petrolRequest = {
        location: map.getCenter(),
        radius: 5000,
        types: ['gas_station']
    }

    requests.push(medsRequest);
    requests.push(shopsRequest);
    requests.push(petrolRequest);

    service = new google.maps.places.PlacesService(map);
    for (var i = 0; i < requests.length; i++) {
        service.nearbySearch(requests[i], function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    //console.log(results[i]);
                    if (results[i].icon === "https://maps.gstatic.com/mapfiles/place_api/icons/doctor-71.png") {
                        createMarker(meds, results[i]);
                    } else if (results[i].icon === "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png") {
                        createMarker(shops, results[i]);
                    } else if (results[i].icon == "https://maps.gstatic.com/mapfiles/place_api/icons/gas_station-71.png") {
                        createMarker(petrol, results[i]);
                    }
                }
            }
        });
    }

}

function createMarker(array, place) {
    //debugging here
    //console.log(JSON.parse(JSON.stringify(place)));

    //some location
    var location = place.geometry.location;
    //icons
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

    google.maps.event.addListener(marker, "click", function() {

        service.getDetails({
            placeId: place.place_id
        }, function(placeInfo, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var placeNum = '';
                var placeOpen = '';
                var tradeString = '';

                if (infowindow != null) {
                    infowindow.close();
                }

                if (placeInfo.formatted_phone_number) {
                    placeNum = placeInfo.formatted_phone_number;
                } else {
                    placeNum = 'N/A';
                }

                console.log("NUM: " + placeNum);

                if (placeInfo.opening_hours) {
                    if (placeInfo.opening_hours.open_now == true) {
                        placeOpen = '</ p><p><b><font color="green">OPEN</font><b></p>';
                    } else {
                        placeOpen = '</ p><p><b><font color="red">CLOSED</font><b></p>';
                    }

                    //some fruit loops
                    for (var i = 0; i < placeInfo.opening_hours.weekday_text.length; i++) {
                        tradeString += '<li>' + placeInfo.opening_hours.weekday_text[i] + '</li>';
                    }
                } else {
                    tradeString += 'N/A';
                }

                console.log("HOURS: " + tradeString);

                infowindow = new google.maps.InfoWindow({
                    content: '<b>' + placeInfo.name + '</b>' + '<p>' +
                        placeInfo.formatted_address + '</p>' +
                        '<p>' + placeNum + '</p>' +
                        placeOpen + '<p><b>Trading Hours:</b></p>' + tradeString +
                        '<p><b><a href = https://www.google.com/maps/dir/' + mapLatLng.lat + ',' + mapLatLng.lng + '/' +
                        place.geometry.location.lat() + ',' + place.geometry.location.lng() + ' target="_blank">Direction</a></b></p>'
                });
                infowindow.setOptions({
                    pixelOffset: new google.maps.Size(-25, 0)
                });
                map.panTo(place.geometry.location);
                infowindow.open(map, marker);
            } else {
                console.log("ran out of api call or unexpected error");
            }
        });
    });
    array.push(marker);

}

// Sets the map on all markers in the array.
function setMapOnAll(markers, map) {
    // console.log("showing markers");
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markers) {
    //console.log("clearing markers");
    setMapOnAll(markers, null);
}

function showShops() {
    //remove w.e. was last
    //then set onto map
    clearMarkers(petrol);
    clearMarkers(meds);
    clearMarkers(shops);
    setMapOnAll(shops, map);
}

function showPetrolStation() {
    clearMarkers(shops);
    clearMarkers(meds);
    clearMarkers(petrol);
    setMapOnAll(petrol, map);
}

function showMeds() {
    clearMarkers(shops);
    clearMarkers(petrol);
    clearMarkers(meds);
    setMapOnAll(meds, map);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function goBack() {
    window.history.back();
}
