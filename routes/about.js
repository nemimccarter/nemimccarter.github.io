var express = require('express');
var router = express.Router();
var models = require('../models');
var fa17g09_env_prefix = require('../prefix');
var User = require('../models/user');

router.get('/', function(req, res, next) {

    // Render About Page and get User info
    res.render('about', {
        title: 'About Page',
        User: req.cookies.User,
        UserState: req.cookies.UserState,
        errors: req.cookies.errors
    });

    res.cookie('errors', '');
});

module.exports = router;
