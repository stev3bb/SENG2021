// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
// revision: 0.4 

/*
Known bugs:
- radius problem 
- info window is not centered with the icons
*/

// Keep map as a global
var map;
// Create a blank array for all map markers
var markers = [];


/*initialise map

summary:
- add event listener- drag
- records the center of the map, and uses it to use place services 
- repaint the markers and refresh the map
*/

function initMap() {
    //variables here

    var infowindow;
    //some default locations popup if al fails
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 10
    });

    google.maps.event.addListener(map, 'dragend', function() { 
        //alert(map.getCenter()); 


        //clear markers here
        clearMarkers();
        markers = [];
        


        var request = {
                location: map.getCenter(),
                //max range
                radius: 50000,
                types: ['campground']
        }

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request,callback);


        //add the pointers here
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;

            var icon = {
                url: place.icon,
                size: new google.maps.Size(71,71),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point (17,34),
                scaledSize: new google.maps.Size(25,25)
            };

            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                position: place.geometry.location
            });

            //push into array to keep track of the markers
            markers.push(marker);

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }

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
            //location not found
            infoWindow = new google.maps.InfoWindow({
                map: map
            });
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        infoWindow = new google.maps.InfoWindow({
            map: map
        });
        handleLocationError(false, infoWindow, map.getCenter());
    }

    
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Location not found' :
        'Your browser doesn\'t support geolocation.');
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
    var radius = document.getElementById('distval').value;

    //some variables
    var map;
    var service;
    var marker;
    var pos;
    var infowindow;
    var mapOptions = {
      zoom: 10
    };

    //test here

    //if (searchval){
      //  alert(searchval);
    //}


    //if the nearby textbox is tickled and radius confirmed 
    // or if search value or radius is confirmed, then do stuff
    if ((document.getElementById('checkednearby').checked && radius) || (searchval && radius)) {

        //make new map here
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        console.log(map);

        //if geolocation is enabled 
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
              infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'My current location'
              });

              map.setCenter(pos);

              var request = {
                location: pos,
                radius: radius*1000,
                types: ['campground']
              }
              infowindow = new google.maps.InfoWindow();
              var service = new google.maps.places.PlacesService(map);
              service.nearbySearch(request,callback);
            }, function (){
              handleNoGeolocation(true);
            });
        } else {
            handleNoGeolocation(false);
        }

        //add the pointers here
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;

            var icon = {
                url: place.icon,
                size: new google.maps.Size(71,71),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point (17,34),
                scaledSize: new google.maps.Size(25,25)
            };

            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }

        alert(request.get(radius));
    } else {
        return;
        //alert("doing something else")
    }


}