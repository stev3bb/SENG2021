var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('equipment', {
        title: 'Equipment',
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs'}
    });
});

router.get('/:equip', function(req, res, next) {
    res.render('equipment_individual', {
        title: req.params.equip,
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs'}
    });
});

module.exports = router;
