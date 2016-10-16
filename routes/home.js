var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', {
        title: 'Home',
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs', API_KEY: 'partials/api_key'}
    });
});

module.exports = router;
