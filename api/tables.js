var express = require('express');
var router = express.Router();
var TableModel = require('../models/tables.js');
var _ = require('lodash');

router.route('/')
	.get((req, res) => {
		TableModel.find({owner: {
			'$elemMatch': {
				'$eq': req.user.username
			}
		}}, (err, data) => {
			if(err) {
				res.json({
					message: err.message
				});
			} else {
				res.json({
					message: 'all your tables',
					data: data
				});
			}
		});
	});

module.exports = router;