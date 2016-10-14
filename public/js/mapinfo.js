/* new js for the camping information map*/
var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('InfoMap'), {
		center: {lat: -34.397,
		lng: 150.644},
 		zoom: 8
	});
}
