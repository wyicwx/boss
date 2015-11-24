var passport = require('passport');
var UserModel = require('../models/users.js');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.username);
});

passport.deserializeUser((username, done) => {
	UserModel.findOne({username: username}, function(err, user) {
		if(err) {
			return done(null, false);
		}
		done(null, user);
	});
});

passport.use(new LocalStrategy((username, password, done) => {
	UserModel.findOne({username: username, password: password}, function(err, data) {
		if(err) {
			done(err);
		} else {
			if(!data) {
				done(null, false);
			} else {
				done(null, data);
			}
		}
	});
}));