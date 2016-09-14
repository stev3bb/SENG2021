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
  //var loc = {lat: -34.4, lng: 150.6};
  //var test = new google.maps.Marker({
   //   position: loc,
    //  map: map,
     // title: "Test Marker"
  //});

  var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the '+
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
            'south west of the nearest large town, Alice Springs; 450&#160;km '+
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
            'Aboriginal people of the area. It has many springs, waterholes, '+
            'rock caves and ancient paintings. Uluru is listed as a World '+
            'Heritage Site.</p>'+
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    //test.addListener('click', function() {
      //  infowindow.open(map, test);
    //})

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

  if (document.getElementById('checkednearby').checked){

  //getting current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });
  }else{
    //some default location here
    var pos ={lat: -34.397, lng: 150.644};
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


