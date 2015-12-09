var express = require('express');
var router = express.Router();
var RecordsModel = require('../models/records.js');
var tableAuth = require('../components/tableAuth.js');
var _ = require('lodash');

router.route('/history')
	.get((req, res) => {
		var params = _.extend({}, req.body, req.params, req.query);

		tableAuth(req, res, function(ret) {
			RecordsModel.aggregate([
				{
					$match: {
						id: ret.data._id
					}
				},
				{
					$project: {
						time: 1,
						date: {
							$dateToString: {
								format: "%Y-%m-%d",
								date: "$time"
							}
						}
					}
				},
				{
					$group: {
						_id: '$date',
						total: {
							$sum: 1
						}
					}
				}
			]).sort({_id: -1}).exec((err, data) => {
				if(err) {
					return res.status(500).json({
						message: err.message
					});
				}


				res.status(201).json({
					message: '',
					data: data
				});
			});
		});
	});

router.route('/realtime')
	.get((req, res) => {
		var params = _.extend({}, req.body, req.params, req.query);

		var todayTime = new Date();

		todayTime.setHours(0);
		todayTime.setMinutes(0);
		todayTime.setSeconds(0);
		todayTime.setMilliseconds(0);


		tableAuth(req, res, function(ret) {
			RecordsModel.aggregate([
				{
					$match: {
						id: ret.data._id,
						time: {
							$gt: todayTime
						}
					}
				},
				{
					$project: {
						time: 1,
						// date: '$time'
						date: {
							$dateToString: {
								format: "%Y-%m-%d %H:%M",
								date: "$time"
							}
						}
					}
				},
				{
					$group: {
						_id: '$date',
						total: {
							$sum: 1
						}
					}
				}
			]).sort({_id: 1}).exec((err, data) => {
				if(err) {
					return res.status(500).json({
						message: err.message
					});
				}

				console.log(data);

				res.status(201).json({
					message: '',
					data: data
				});
			});
		});
	});


module.exports = router;