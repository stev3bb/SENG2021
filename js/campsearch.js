// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var map;
// Create a blank array for all map markers
var markers = [];

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 12
  });
  //var directionsDisplay = new google.maps.DirectionsRenderer;
  //var directionsService = new google.maps.DirectionsService;

  var campsites = [
      {title: 'TEST MARKER', location: {lat: -34.4, lng: 150.6}},
      {title: 'Honeymoon Bay', location: {lat: -35.01792, lng: 150.807818}},
      {title: 'Cockatoo Island', location: {lat: -33.8476028, lng: 151.1709488}},
  ]

  var largeInfoWindow = new google.maps.InfoWindow();

  for (var i = 0; i < campsites.length; i++) {
      // Get the location of the campsite
      var pos = campsites[i].location;
      var title = campsites[i].title;
      // Create a marker for each location and add to markers array
      var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: title,
          animation: google.maps.animation.DROP,
          id: i
      })
      markers.push(marker);
      marker.addListener('click', function() {
          populateInfoWindow(this, largeInfoWindow);
      })
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
      var infoWindow = new google.maps.InfoWindow({map: map});
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    var infoWindow = new google.maps.InfoWindow({map: map});
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Location not found':
                        'Your browser doesn\'t support geolocation.');
}

function search() {
//search functionality goes here
  var searchval = document.getElementById('value').value;
  var radius = document.getElementById('distval').value;
  //position
  var pos;

  if (document.getElementById('checkednearby').checked){

  //getting current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

    infowindow = new google.maps.InfoWindow({
      map: map,
      position: pos,
      content: 'Located'
    });
  }else{
    //some default location here
    pos ={lat: -34.397, lng: 150.644};
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    center: pos,
    //fix hardcoded value here
    zoom: 10
  });

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pos,
    radius: radius,
    type: ['campground']
  }, callback);

  function callback(results, status) {
   if (status === google.maps.places.PlacesServiceStatus.OK) {
   for (var i = 0; i < results.length; i++) {
     createMarker(results[i]);
     }
    }
  }

  function createMarker(place) {
   var placeLoc = place.geometry.location;
   var marker = new google.maps.Marker({
    map: map,
   position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
   infowindow.open(map, this);
   });
  }

    alert("fuck yea do something");
  }else{
    alert("doing something else")
  }


}
