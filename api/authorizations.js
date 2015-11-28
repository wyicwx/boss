var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/')
	.get((req, res) => {
		res.json({
			message: 'Authorization passed',
			data: {
				username: req.user.username,
				_id: req.user._id
			}
		});
	})
	.post(passport.authenticate('local'), function(req, res) {
		res.json({
			message: 'Authorization passed',
			data: {
				username: req.user.username,
				_id: req.user._id
			}
		});
	})
	.delete(function(req, res) {
		req.logOut();
		res.status(204);
		res.end();
	});



module.exports = router;