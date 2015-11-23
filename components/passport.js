var passport = require('passport');
var UserModel = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new LocalStrategy((username, password, done) => {
	UserModel.find({username: username}, function(err, data) {
		done(null, {
			username: data.username
		});
	});
}));