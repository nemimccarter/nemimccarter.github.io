var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql');

const Op = models.sequelize.Op;

router.get('/', function(req, res, next) {
    res.render('sendMsg', {
        title: "Send New Message"
    });
});

module.exports = router;
