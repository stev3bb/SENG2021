/* new js for the camping information map*/

function newInfoMap (){
	var map = new google.maps.Map(document.getElementById('infoMap'), {
		center: {
			siteLat:,
			siteLng:
		},
		mapTypeControl: false,
		zoom: 10
	});
	
}