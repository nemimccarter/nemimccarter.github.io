var express = require('express');
var router = express.Router();
var models = require('../models');
var mysql = require('mysql');

const Op = models.sequelize.Op;

router.get('/', function(req, res, next) {
  var userId;

  if(req.cookies.UserState == undefined) {
    req.cookies.UserState = 0;
    userId = 0;
  } else {
    userId = req.cookies.UserState;
  }  
  console.log(userId);
  //var sql = "SELECT sender, content FROM Messages WHERE receiver='"+ userId +"' ORDER BY sender";



  models.Message.findAll({
    where: {
      receiver: userId
    }
  })
  .then(function(results) {
    res.render('getMessages', {
      results: results,
      UserState: req.cookies.UserState,
      User: req.cookies.User
  });
  });



  // con.query(sql, function (err, result, fields) {
  //     if (err) throw err;
  //     var obj;
  //     console.log(result);
  //     //console.log(result[0].sender);
  //     // for(var i = 0; i < result.length; i++) {
  //     //   console.log(result[i].sender);
  //     //   for(var j = i+1; j < result.length; j++) {
  //     //     if(result[i].sender == result[j].sender) {
  //     //       console.log(result[i].content);
  //     //       i=j;
  //     //       if(i+1 == result.length) console.log(result[result.length-1].content);
  //     //     } else {
  //     //       console.log(result[i].content);
  //     //       break;
  //     //     }
  //     //   }
  //     // }
  //     res.render('getMessages', {
  //         results: result
  //     });
  //   });
});


module.exports = router;
