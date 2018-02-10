var express = require('express');
var router = express.Router();
var models = require('../models');
var fa17g09_env_prefix = require('../prefix');
var User = require('../models/user');

router.get('/', function(req, res, next) {
    var userState = req.cookies.UserState;
    if (!userState) {
        res.cookie('UserState', '0');
        userState = 0;
    }

    models.Listing.findAll().then(function(listings) {
        res.render('terms', {
            title: 'Terms and Agreement',
            User: req.cookies.User,
            UserState: userState,
            errors: req.cookies.errors
        });
    });
    res.cookie('errors', '');
});

module.exports = router;
