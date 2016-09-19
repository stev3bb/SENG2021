// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// revision: 0.5


/*
Known bugs:
- none at the time
*/

// Keep map as a global
var map;
// Create a blank array for all map markers
var markers = [];
var infowindow;


/*initialise map

summary:
- add event listener- drag
- records the center of the map, and uses it to use place services
- repaint the markers and refresh the map
*/

function initMap() {
    //variables here
    //some default locations popup if al fails
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 10
    });
    //var directionsDisplay = new google.maps.DirectionsRenderer;
    //var directionsService = new google.maps.DirectionsService;

    google.maps.event.addListener(map, 'dragend', function() {
        //alert(map.getCenter());

        //clear markers here
        deleteMarkers();

        var request = {
                location: map.getCenter(),
                //max range
                radius: 50000,
                types: ['campground']
        }

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request,callback);
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);

            //add a marker where u are
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: "current location"
            });
        }, function() {
            //location not found - DO NOTHING
        });
    } else {
            // Browser doesn't support Geolocation - DO NOTHING
    }
}

//stolen functions mahahahaha
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

/*
search function
summary:
- search for camping ground nearby or camping ground near the place that is searched
- radius is currently broken
- text box is not centered with the icon (broken af)
- if pin is clicked, maybe want to get the address for the person to know how to get there or link to another
google map page on how to drive there
- search box is currently broken (fixing is under way)

*/

function search() {

    //search functionality goes here
    var searchval = document.getElementById('value').value;
    //some variables
    var service;
    var marker;
    var pos;
    var mapOptions = {
      zoom: 10
    };
    //auto complete object
    var autocomplete;
    //australia region bounds
    var country ={
        center: {lat: -25.3, lng: 133.8},
        zoom: 4
    };


    //make new map here
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //console.log(map);

    if (searchval){
       // show some auto complete bull shit, inject it into some array/harsh then geocode
        var displaySuggestions = function(predictions, status) {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
          }
          //draws out a list of prediction, this does it iteratively(debugging only)/use this to push into array
          predictions.forEach(function(prediction) {
           var n = document.getElementById('results')
                      .appendChild(document.createElement('li')),
                s = new google.maps.places
                      .PlacesService(n.appendChild(document.createElement('div'))),
                p = prediction.description;
                
                s.getDetails({reference:prediction.reference},
                          function(details,status){
                            n.appendChild(document.createTextNode(p));
                            n.appendChild(document.createElement('br'));
                            n.appendChild(document.createTextNode(
                              details.geometry.location.toString()));
                          });
            });
        };

        var service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: searchval }, displaySuggestions);
    }else{
        //if geolocation is enabled
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
              service.nearbySearch(request, callback);
            }, function (){});
        }else{
            //fail here
            return;
        }
    }
}

var callback = function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            //console.log(results[i]);
            createMarker(results[i]);
        }
    }
}

var createMarker = function(place) {
    var placeLoc = place.geometry.location;

    var icon = {
        url: place.icon,
        size: new google.maps.Size(71,71),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point (10,34),
        scaledSize: new google.maps.Size(25,25)
    };

    var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        position: place.geometry.location
    });

    markers.push(marker);

    var distance = google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, map.getCenter());
    console.log(place.name, distance)

    google.maps.event.addListener(marker, 'click', function() {
        var placeR;
        if (place.rating == undefined){
            placeR = "(no rating)";
        }else{
            placeR = place.rating + ' stars';
        }
        infowindow.setContent('<div>' + place.name + ' <b>' + placeR + ' </b></div>');
        infowindow.setOptions({pixelOffset: new google.maps.Size(-25, 0)})
        infowindow.open(map, marker);
    });
}
