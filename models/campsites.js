var mongoose = require('mongoose');

var campsitesSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    phone: String,
    rating: String
});

mongoose.model('campsites', campsitesSchema);
