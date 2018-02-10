var express = require('express');
var router = express.Router();
var models = require('../models');
var fa17g09_env_prefix = require('../prefix');
var User = require('../models/user');

/* GET home page. */
router.get('/' + fa17g09_env_prefix, function(req, res, next) {
    var userState = req.cookies.UserState;
    var user = req.cookies.User;

    if (!userState) {
        res.cookie('UserState', '0');
        userState = 0;
    }

    if (!user) {
        user = new Object();
        user.userType = 'guest';
        res.cookie('User', user);
    }

    models.Listing.findAll().then(function(listings) {
        res.render('index', {
            title: 'Home Page',
            listings: listings,
            layout: './layouts/home-layout', // Set custom layout for single render
            User: user,
            UserState: userState,
            errors: req.cookies.errors
        });
    });
    res.cookie('errors', '');
});

module.exports = router;
