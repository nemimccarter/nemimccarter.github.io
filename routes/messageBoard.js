var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql');

const Op = models.sequelize.Op;

router.get('/', function(req, res, next) {
    var userId = req.cookies.UserState;
    var user = req.cookies.User;

    models.Message.findAll({
        where: {
            receiver: userId
        }
    })
    .then(function(messages) {
        var senderIds = [];
        messages.forEach(function(message) {
            senderIds.push(message.sender);
        });
        models.User.findAll({

                where: {
                    id: {
                        [Op.in]: senderIds
                    }
                }
        }).then(function(senders) {
            var senderToUser = new Map();


            messages.forEach(function(message) {
                var senderObject = getSenderObject(message, senders);
                console.log("senderObject f n " + senderObject.firstName);
                senderToUser.set(message.sender, senderObject);
                console.log("message.sender " + message.sender);

            });
            res.render('messageBoard', {
                title: "Your Inbox",
                messages: messages,
                senderToUser: senderToUser,
                UserState: req.cookies.UserState,
                User: req.cookies.User,
            });
        });
    });
});

function getSenderObject(message, senders) {
    var sender;
    senders.forEach(function(thisSender) {
        if (message.sender == thisSender.id) {
            console.log("found sender " + thisSender);
            sender = thisSender;
        }
    });
    return sender;
}

module.exports = router;
