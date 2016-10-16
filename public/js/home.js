
var autocomplete;

function querySearch() {
    var place = autocomplete.getPlace();
    if (place) {
        var loc = place.place_id;
        document.location.href = '/campsearch?location=' + loc;
    }
}

function nearbySearch() {
    document.location.href = '/campsearch?nearby=true';
}

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('location')), {
            types: ['geocode'],
            componentRestrictions: {country: 'au'}
        });
}
