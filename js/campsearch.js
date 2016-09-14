// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 12
  });
  //var directionsDisplay = new google.maps.DirectionsRenderer;
  //var directionsService = new google.maps.DirectionsService;

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
    //var infoWindow = new google.maps.InfoWindow({map: map});
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
  alert(searchval);
}
