var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql');

const Op = models.sequelize.Op;

var listings;

router.get('/', function(req, res, next) {

    models.Listing.findAll({
        where: {
        }
      })
    .then(function(response) {
        listings = response;
    })
    .then(function(response) {
        models.User.findAll({
            where: {
            }
          })
        .then(function(results) {
            res.render('adminDashboard', {
              results: results,
              listingsResult : listings
            });
        });
    });
});

router.post('/removeListing', function(req, res, next) {
    models.Listing.destroy({
        where: {
            id: req.body.listingId
        }
    })
    .then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
           console.log('Deleted successfully');
         }
    }, function(err){
          console.log(err); 
    });
});

router.post('/removeUser', function(req, res, next) {
    models.User.destroy({
        where: {
            email: req.body.userEmail
        }
    })
    .then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
           console.log('Deleted successfully');
         }
    }, function(err){
          console.log(err); 
    });
});


module.exports = router;
