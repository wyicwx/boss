var express = require('express');
var router = express.Router();
var TableModel = require('../models/tables.js');
var _ = require('lodash');

router.route('/')
	.get((req, res) => {
		TableModel.findOne({_id: req.query._id}, (err, data) => {
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
	})
	.post((req, res) => {
		var params = req.body;
		var owner = params.owner.split(',');

		// verify
		owner.push(req.user.username);
		owner = _.uniq(owner);
		owner = _.compact(owner);

		var model = new TableModel({
			name: params.name,
			owner: owner,
			struct: _.compact(params.struct.split(',')),
			observer: _.compact(params.observer.split(',')),
			password: params.password,
			timestamp: new Date()
		});
		model.sample();

		var error = model.validateSync();
		if(error) {
			return res.status(400).json({
				message: 'Table create error',
				error: error.errors
			});
		}

		TableModel.findOne({name: params.name}, function(err, data) {
			if(err) {
				return res.status(500).json({
					message: err.message
				});
			}
			if(data) {
				return res.status(400).json({
					message: 'Table name repeated'
				});
			}

			model.save((err, data) => {
				if(err) {
					res.status(500).json({
						message: err.message
					});
				} else {
					res.status(201).json({
						message: 'Table created',
						data: data
					});
				}
			});
		});
	})
	.put((req, res) => {
		res.json({
			message: 'Forbidden'
		});
	})
	.patch((req, res) => {
		
	});

module.exports = router;