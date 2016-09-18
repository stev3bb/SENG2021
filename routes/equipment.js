var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('equipment', {
        title: 'Equipment',
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs'}
    });
});

module.exports = router;
