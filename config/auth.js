var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var key = "dkjfskjdf";

module.exports = function(app, models){

	
	app.use(passport.initialize());
	app.use(passport.session());

	// passport config
	passport.use(new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'password',
    session: false
    }, function(email, password, done, err) {
        var cipher = crypto.createCipher('aes-256-ctr', key).update(password, 'utf-8', 'hex');
  
        models.User.findOne({ where: {email: email, password: cipher}}).then(user => {
            if (err) { 
                return done(err); 
            }
            
            if (!user) { 
                return done(null, false); 
            }
      		return done(null, user);
    		});
  		}
		)); 
	passport.serializeUser(function(user, done) {
		console.log('serializing user: ');
    	console.log(user);
	 	done(null, user.id);
	});

	
};
