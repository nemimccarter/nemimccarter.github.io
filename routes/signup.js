var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');
var crypto = require('crypto');
var key = "dkjfskjdf";

/* GET signup page. */
router.get('/', function(req, res, next) {
  res.render('signup', {
    UserState: req.cookies.UserState
  });
});

/* POST new user. */
router.post('/', function(req, res) {

    var cipher = crypto.createCipher('aes-256-ctr', key).update(req.body.password, 'utf-8', 'hex');
    var userType = '';
    if (req.body.listingAgent) {
        userType = 'listingAgent';
    } else {
        userType = 'client';
    }

    var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userType: userType,
        password: cipher,
        email: req.body.email
    };

    models.User.create(user).then(function(newUser) {
        console.log("user type: " + userType);
        res.redirect('signup');
    });

});

module.exports = router;

function redirectToView(res, inputErrors) {
    res.render('signup', {
        errors: inputErrors,
        UserState: req.cookies.UserState
    });
}

function inputValidationErrors(req) {
    var errors = [];

    if(!req.body.email || !validator.isEmail(req.body.email)) {
        errors.push("Please enter a valid email address.");
    }

    if(!req.body.firstName || !req.body.lastName || !validator.isAlpha(req.body.firstName) || !validator.isAlpha(req.body.lastName)) {
        errors.push("First or last name not entered or unsupported character(s) in first name or last name.");
    }

    if(!req.body.Phone || !validator.isAscii(req.body.Phone)) {
        errors.push("Phone number not entered or unsupported character(s) in phone number.");
    }

    if(!req.body.password || !req.body.confirmPassword || !validator.isAscii(req.body.password) || !validator.isAscii(req.body.confirmPassword)) {
        errors.push("Passwords not entered or unsupported character(s) in password.");
    }

    if(req.body.password != req.body.confirmPassword) {
        errors.push("Passwords do not match");
    }
    // at this point we've verified that values are present and just want to verify field length:

    var lengthError = " is too long, has to be under 40 characters";

    if(req.body.email.length > 40) {
        errors.push("Email" + lengthError);
    }

    if(req.body.firstName.length > 40) {
        errors.push("First name" + lengthError);
    }

    if(req.body.lastName.length > 40) {
        errors.push("Last name" + lengthError);
    }

    if(req.body.Phone.length > 40 || req.body.Phone.length < 9) {
        errors.push("Please enter a valid phone number");
    }

    if(req.body.password.length > 40) {
        errors.push("Password" + lengthError);
    }

    return errors;
}
