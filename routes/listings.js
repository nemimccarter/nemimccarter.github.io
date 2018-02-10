var express = require('express');
var router = express.Router();
var models = require('../models');
var uuid = require("uuid");
var thumb = require('node-thumbnail').thumb;
var path = require('path');

const fileUpload = require('express-fileupload');

router.use(fileUpload());

/* GET listings page. */
router.get('/', function(req, res, next) {
    res.render('listings' , {
        title: 'Listings',
        errors: req.cookies.errors,
        UserState: req.cookies.UserState,
        User: req.cookies.User
    });

});


/* POST new listing. */
router.post('/', function(req, res) {

    var listing = {
        UserId: req.cookies.UserState,
        address: req.body.Address,
        thumbnail: '', // no thumbnail for now, we add it below
        city: req.body.City,
        state: req.body.State,
        zipcode: req.body.zipcode,
        numBedrooms: req.body.numBedrooms,
        numBathrooms: req.body.numBathrooms,
        squareFeet: req.body.squareFeet,
        price: req.body.price,
        description: req.body.description
    };

    models.Listing.create(listing).then(function(listing) {
           var imageFile = req.files.imageFile;

           var firstImageName = uuid.v4() + path.extname(req.files.imageFile.name);

           var media = models.Media.create({
                ListingId: listing.id,
                imageFilePath: 'assets/' + firstImageName
           });

           imageFile.mv(__dirname + '/../public/assets/' + firstImageName, function(err) {
                  if (err){
                          return res.status(500).send(err);
                  }
           });

           var imageFile2 = req.files.imageFile2;

           var secondImageName = uuid.v4() + path.extname(req.files.imageFile.name);

           var media2 = models.Media.create({
               ListingId: listing.id,
               imageFilePath: 'assets/' + secondImageName
           });

           imageFile2.mv(__dirname + '/../public/assets/' + secondImageName, function(err) {
                  if (err){
                          return res.status(500).send(err);
                  } else {
                          createThumbnail(__dirname + '/../public/assets/' + firstImageName, __dirname + '/../public/assets/');
                          listing.update({
                              thumbnail: 'assets/' + path.basename(firstImageName, path.extname(firstImageName)) + '_thumb' + path.extname(firstImageName)
                          }).then(() => {});
                          res.redirect('listings');
                  }
           });
    });
});

module.exports = router;

function createThumbnail(sourcePath, destPath) {
    thumb({
      source: sourcePath,
      destination: destPath,
      width: 400,
      concurrency: 1
    }, function(files, err, stdout, stderr) {
      console.log('Thumbnail created.');
    });
}
