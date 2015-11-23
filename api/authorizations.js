var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/')
	.get((req, res, next) => {
		if(req.user) {
			res.json({
				message: 'authorization pass',
				data: req.user
			});
		} else {
			res.status(401).json({
				message: 'authorization fobidden'
			});
		}
	})
	.post(passport.authenticate('local', {
		successRedirect: '/api/authorizations',
		failureRedirect: '/api/authorizations',
		failureFlash: false 
	}));



module.exports = router;