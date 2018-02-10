var express = require('express');
var router = express.Router();
var models = require('../models');
var expressValidator = require('express-validator');

const Op = models.sequelize.Op;

router.use(expressValidator());

/* POST search page
   '/' is NOT Home page
*/
router.post('/', function(req, res, next) {

    console.log("USER COOKIE: " + req.cookies.User);
    if (req.body.city < 0) {
        req.checkBody('city', 'Error: You entered a negative number').isInt({min: 0});
    }
    req.checkBody('city', 'Search string too long').isLength({max: 40})
        .notEmpty(req.body.city).withMessage('Search field empty. Please enter an address, zip code, city, or state')
    req.sanitize('city')
        .blacklist('!@#$%^*;+');

    var errors = req.validationErrors();
    console.log("Errors object: " + errors);
    if (errors) {
        res.cookie('errors', errors[0]);
        res.redirect('search');
        res.send(errors);
    }
    else {
        // var queryBuilderArguments = {searchString : req.body.city};
        // if(req.body.sortOption) {
        //     queryBuilderArguments.orderMode = req.body.sortOption;
        // }

        models.Listing.findAll(buildListingsQuery(req)).then(function(listings) {
            res.render('search', { // render the Search/Browse page
                title: 'Search',
                listings: listings,
                previousSearchString: req.body.city,
                previousSortOption: req.body.sortOption,
                bedFilterOption: req.body.bedFilterOption ? req.body.bedFilterOption : 0,
                bathFilterOption: req.body.bathFilterOption ? req.body.bathFilterOption : 0,
                UserState: req.cookies.UserState,
                User: req.cookies.User,
                errors: req.cookies.errors
            });

            // START HOW TO GET AND USE ASSOCIATED MODELS
            console.log(models.Listing.prototype);

            listings.forEach(function(listing) {
                console.log("listing.address: " + listing.address);
                listing.getMedia().then(function(media){
                    media.forEach(function(medium) {
                        console.log("medium.id: " + medium.id + ", medium.imageFilePath: " + medium.imageFilePath);
                    });
                });
            });
            // END HOW TO GET AND USE ASSOCIATED MODELS
        });
    }
});

router.get('/', function(req, res, next) {
    //res.sendFile(path.join(__dirname + '/index.html'));
    models.Listing.findAll()
    .then(function(listings) {
        res.render('search', { // render the Search/Browse page
            title: 'Search',
            listings: listings,
            previousSearchString: req.body.city,
            previousSortOption: req.body.sortOption,
            bedFilterOption: req.body.bedFilterOption ? req.body.bedFilterOption : 0,
            bathFilterOption: req.body.bathFilterOption ? req.body.bathFilterOption : 0,
            UserState: req.cookies.UserState,
            User: req.cookies.User,
            errors: req.cookies.errors
        });
    });
    console.log("break");
    console.log(req.body.listings);
    console.log(req.cookies.errors);
    res.cookie('errors', '');
});

module.exports = router;

function buildListingsQuery(req) {
    var sequelizeQuery = {
        include: [ models.Media ] // !! This line requests retrieval of the associated model.
	};

    if (! req.body.city){
        req.body.city = "";
    }
    
    sequelizeQuery.where = {
        [Op.or]: [
            {
                address: {
                    [Op.like]: '%' + req.body.city + '%'
                }
            },
            {
		        city: {
                    [Op.like]: '%' + req.body.city + '%'
                }
            },
            {
                state: {
                    [Op.like]: '%' + req.body.city + '%'
                }
            },
            {
                zipcode: {
                    [Op.like]: '%' + req.body.city + '%'
                }
            }
        ],
        [Op.and]: [
            {
                numBedrooms: {
                    [Op.gte]: req.body.bedFilterOption ? req.body.bedFilterOption : 0
                }
            },
            {
                numBathrooms: {
                    [Op.gte]: req.body.bathFilterOption ? req.body.bathFilterOption : 0
                }
            }
        ]
		};


    if (req.body.sortOption){
        sequelizeQuery.order = models.sequelize.literal(req.body.sortOption);
    }

    return sequelizeQuery;
}
