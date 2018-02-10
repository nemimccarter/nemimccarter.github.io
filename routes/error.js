var express = require('express');
var router = express.Router();
var models = require('../models');

const Op = models.sequelize.Op;

router.get('/', function(req, res, next) {
    res.render('error', {
        
    });
});

module.exports = router;
