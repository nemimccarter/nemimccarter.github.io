var express = require('express');
var router = express.Router();
var models = require('../models');
var fa17g09_env_prefix = require('../prefix');
var User = require('../models/user');

router.get('/:member?', function(req, res, next) {

    var member = req.query.member;
    var memberName;
    var memberRole;

    if (member == 'kn') {
        memberName = "Khanh Nguyen";
        memberRole = "Frontend Lead";
    } else if (member == 'nm') {
        memberName = "Nemi McCarter-Ribakoff";
        memberRole = "Backend Lead";
    } else if (member == 'fb') {
        memberName = "Franklin Boswell";
        memberRole = "Team Lead";
    } else if (member == 'es') {
        memberName = "Evgeny \"Eugene\" Stukalov";
        memberRole = "Backend Developer";
    } else if (member == 'kl') {
        memberName = "Kevin Lay";
        memberRole = "Backend Developer";
    } else if (member == 'jc') {
        memberName = "Jesse Christiansen";
        memberRole = "Frontend Developer";
    }

    // Render About Page and get User info
    res.render('aboutMember', {
        title: 'About Member Page',
        member: member,
        memberName: memberName,
        memberRole: memberRole,
        User: req.cookies.User,
        UserState: req.cookies.UserState,
        errors: req.cookies.errors
    });

    res.cookie('errors', '');
});

module.exports = router;
