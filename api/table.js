var express = require('express');
var router = express.Router();
var TableModel = require('../models/tables.js');
var _ = require('lodash');
var tableAuth = require('../components/tableAuth.js');

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
		var owner = (params.owner||'').split(',');

		// verify
		owner.push(req.user.username);
		owner = _.uniq(owner);
		owner = _.compact(owner);

		var model = new TableModel({
			name: params.name,
			owner: owner,
			struct: _.compact((params.struct||'').split(',')),
			observer: _.compact((params.observer||'').split(',')),
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
	})
	.put((req, res) => {
		tableAuth(req, res, function(ret) {
			if(!ret.isOwner) {
				res.json({
					message: 'Forbidden'
				});
			} else {
				var updateData = _.pick(req.body, ['name', 'owner', 'observer', 'struct', 'dimension', 'description', 'token']);

				if(_(updateData.owner).indexOf(req.user.username) == -1) {
					updateData.owner.unshift(req.user.username);
				}
				TableModel.update({
					_id: ret.data._id
				}, {
					'$set': updateData
				}, {}, (err, data) => {
					if(err) {
						return res.status(500).json({
							message: err.message
						});
					}
					res.status(201).json({
						message: 'Table updated',
						data: _.extend(ret.data, updateData)
					});
				});

			}
		});
	})
	.patch((req, res) => {
		
	});

module.exports = router;