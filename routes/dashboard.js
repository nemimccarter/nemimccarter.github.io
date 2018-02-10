var express = require('express');
var router = express.Router();
var models = require('../models');

const Op = models.sequelize.Op;

router.get('/', function(req, res, next) {
    var userId;
    var totalUsers = [];
    
    userId = req.cookies.UserState;
    var flag = true;
    models.Message.findAll({
        where: {
            receiver: userId
        }
    }).then(function(messages) {
        for(var i = 0; i < messages.length; i++ ){
            console.log("Id ", messages[i].sender);
            models.User.findOne({
                where: {
                    id: messages[i].sender
                }
            }).then(function(user) {
                if(flag) {
                    totalUsers.push(user);
                    flag = false;
                }
                for(var j = 0; j < totalUsers.length; j++) {
                    if(totalUsers[j].id != user.id) {
                        totalUsers.push(user);
                        console.log("pushing");
                    }
                }
            })
        }
    }).then(function(test){
        models.Listing.findAll({
            where: {
                UserId: req.cookies.UserState
            }
        }).then(function(listings) {
            res.render('dashboard', {
                title: 'Welcome to Your Dashboard',
                listings: listings,
                totalUsers: totalUsers,
                UserState: req.cookies.UserState,
                User: req.cookies.User
            });
        });
    });
});

module.exports = router;
