var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
    res.render('campsites', {
        id: req.params.id,
        partials: {header: 'partials/header', navbar: 'partials/navbar', bottomJs: 'partials/bottomJs'}
    });
});

module.exports = router;
