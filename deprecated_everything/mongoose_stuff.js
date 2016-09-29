// Post to the provided URL with the specified parameters.
function post(parameters) {
    var form = $('<form></form>');

    form.attr("method", "post");
    form.attr("action", "/campsearch");

    $.each(parameters, function(key, value) {
        var field = $('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
    });

    // The form needs to be a part of the document in
    // order for us to be able to submit it.
    $(document.body).append(form);
    form.submit();
}

---

var mongoose = require('mongoose');

var campsitesSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    phone: String,
    rating: String
});

mongoose.model('Campsites', campsitesSchema);

---

var mongoose = require('mongoose');
var Campsites = mongoose.model('Campsites');

router.get('/', function(req, res, next) {
    Campsites.find({}, function(err, data) {
        if (err) throw err;
        res.render('campsearch', {
            title: 'Campsite Search',
            partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs', API_KEY: 'partials/api_key'},
            qs: req.query,
            campsites: data
        });
    })

});

router.post('/', urlencodedParser, function(req, res) {
    var newCampsite = Campsites({
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        rating: req.body.rating
    }).save(function(err, data) {
        if (err) throw err;
        res.json(data);
    })
});
