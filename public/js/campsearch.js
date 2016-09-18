// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// Keep map as a global
var map;
// Create a blank array for all map markers
var markers = [];


/*initialise map:
it will show the near by camping grounds as i scroll through the map
*/

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 12
    });
    //var directionsDisplay = new google.maps.DirectionsRenderer;
    //var directionsService = new google.maps.DirectionsService;

    var campsites = [{
        title: 'TEST MARKER',
        location: {
            lat: -34.4,
            lng: 150.6
        }
    }, {
        title: 'Honeymoon Bay',
        location: {
            lat: -35.01792,
            lng: 150.807818
        }
    }, {
        title: 'Cockatoo Island',
        location: {
            lat: -33.8476028,
            lng: 151.1709488
        }
    }, ]

    var largeInfoWindow = new google.maps.InfoWindow();
    // Testing initial zoom size to fit all markers
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < campsites.length; i++) {
        // Get the location of the campsite
        var pos = campsites[i].location;
        var title = campsites[i].title;
        // Create a marker for each location and add to markers array
        var marker = new google.maps.Marker({
            map: map,
            position: pos,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);

        // Extend the boundaries for each given marker
        bounds.extend(marker.position);

        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
        });
    }
    map.fitBounds(bounds);

    // document.getElementById('show-markers').addEventListener('click', showMarkers);
    // document.getElementById('hide-markers').addEventListener('click', hideMarkers);

    // Populates the info window when a marker is clicked
    function populateInfoWindow(marker, info_window) {
        // If the info_window is not already open on the current marker
        if (info_window.marker != marker) {
            info_window.marker = marker;
            info_window.setContent('<div>' + marker.title + '</div>');
            info_window.open(map, marker);
            // Clear the marker if the window is closed
            info_window.addListener('closeclick', function() {
                info_window.marker = null;
            });
        }
    }

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
            var infoWindow = new google.maps.InfoWindow({
                map: map
            });
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        var infoWindow = new google.maps.InfoWindow({
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


    //if the nearby textbox is tickled
    if (document.getElementById('checkednearby').checked && radius) {

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