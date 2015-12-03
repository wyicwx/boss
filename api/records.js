var express = require('express');
var router = express.Router();
var RecordsModel = require('../models/records.js');
var tableAuth = require('../components/tableAuth.js');
var _ = require('lodash');

router.route('/')
	.get((req, res) => {
		var params = _.extend({}, req.body, req.params, req.query);
		var limit = params.limit || 20;
		var page = params.page || 1;

		tableAuth(req, res, function(ret) {
			RecordsModel.find({id: params._id}).limit(limit).skip((page-1)*limit).sort({time: -1}).exec((err, data) => {
				if(err) {
					return res.status(500).json({
						message: err.message
					});
				}
				res.json({
					message: '',
					data: data,
					table: ret.data
				});
			});
		});
	})
	.post((req, res) => {
		var model = new RecordsModel();
		model.record(req, function(err) {
			if(err) {
				res.json(err);
			} else {
				res.status(200).end();
			}
		});
	});

module.exports = router;