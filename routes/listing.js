var express = require('express');
var router = express.Router();
var models = require('../models');
var validator = require('validator');

const Op = models.sequelize.Op;

var prevReq;

router.get('/:listing?', function(req, res, next) {
    var listingid = req.query.listing;
    prevReq = listingid;

    console.log("User state is ", req.cookies.UserState);
    console.log("User is ", req.cookies.User);
    
    models.Listing.findOne({where: {id: listingid}})
    .then(function(listing) {
        models.Media.findAll({where: {listingid: listingid}})
        .then(function(media) {
            for (var i = 0; i < media.length; i++) {
                media[i].imageFilePath = '../' + media[i].imageFilePath;
            }
            models.User.findOne({where: {id: listing.UserId}})
            .then(function(user) {
                res.render('listing', { // render the Listing page
                    title: 'Listing - GET', // remove 'GET'
                    listing: listing,
                    media: media,
                    user: user, // listing agent
                    errors: [],
                    User: req.cookies.User,
                    UserState: req.cookies.UserState
                });
            });
        });

    });

});

router.post('/', function(req, res, next) {

    var inputErrors = inputValidationErrors(req);
    
        if (inputErrors.length <= 0) {

            var listingid = prevReq;
            var userId;
            var receiverId;

            if(req.cookies.UserState == undefined) {
                req.cookies.UserState = 0;
                userId = 0;
            } else {
                userId = req.cookies.UserState;
            }  
              console.log(userId);

            models.Listing.findOne({where: {id: listingid}})
            .then(function(listing) {
                receiverId = listing.UserId;
                var message = {
                    sender: userId,
                    receiver: receiverId,
                    content: req.body.msg,
                };
                
                models.Message.create(message).then(function(newUser) {
                    console.log("ran");
                });
            });
            
            models.Listing.findOne({where: {id: listingid}})
            .then(function(listing) {
                models.Media.findAll({where: {listingid: listingid}})
                .then(function(media) {
                    for (var i = 0; i < media.length; i++) {
                        media[i].imageFilePath = './' + media[i].imageFilePath;
                    }
                    models.User.findOne({where: {id: listing.UserId}})
                    .then(function(user) {
                        res.render('listing', { // render the Listing page
                            title: 'Listing - GET', // remove 'GET'
                            listing: listing,
                            media: media,
                            user: user, // listing agent
                            errors: [],
                            UserState: req.cookies.UserState,
                            User: req.cookies.User
                        });
                    });
                });
            });

        } else {

            console.log(inputErrors);
            res.render('listing', {
                errors: inputErrors,
                UserState: req.cookies.UserState,
                User: res.cookies.User
            });
        }
    
});

function inputValidationErrors(req) {
    var errors = [];

    if(!req.body.email || !validator.isEmail(req.body.email)) {
        errors.push("Please enter a valid email address.");
    }

    if(!req.body.name || req.body.name < 0) {
        errors.push("Name cannot be a number");
    }

    if(!req.body.phone || !validator.isAscii(req.body.phone)) {
        errors.push("Phone number not entered or unsupported character(s) in phone number.");
    }

    var lengthError = " is too long, has to be under 40 characters";

    if(req.body.email.length > 40) {
        errors.push("Email" + lengthError);
    }

    if(req.body.name.length > 40) {
        errors.push("First name" + lengthError);
    }

    if(req.body.phone < 0) {
        errors.push("Phone number cannot be negative");
    }

    if(req.body.phone.length > 40) {
        errors.push("Phone number" + lengthError);
    }

    return errors;
}



module.exports = router;
