
var autocomplete;

function querySearch() {
    var place = autocomplete.getPlace();
    if (place && place.place_id) {
        var loc = place.place_id;
        document.location.href = '/campsearch?location=' + loc;
    } else {
        console.log('ya');
        var input = document.getElementById('location').value;
        document.getElementById('invalid').innerHTML = "'<span style='color:red'>" + input + "</span>' is not a valid Google place. Please select an option from the dropdown list.";
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
