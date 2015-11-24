var express = require('express');
var router = express.Router();
var TableModel = require('../models/tables.js');
var RecordModel = require('../models/records.js');

router.route('/')
	.get((req, res) => {
		res.json({
			message: 'welcome',
			query: '/:id',
			params: {
				page: 'current page',
				limit: 'per page limit number'
			}
		});
	})
	.post((req, res) => {
		var model = new RecordModel();
		model.record(req, function(err) {
			if(err) {
				res.json(err);
			} else {
				res.status(200).end();
			}
		});
	});

router.get('/:id', (req, res) => {
	var params = req.params;
	var query = req.query;
	var limit = query.limit || 20;
	var page = query.page || 1;

	TableModel.findOne({_id: params.id, '$or': [
		{
			owner: {
				'$elemMatch': {
					'$eq': req.user.username
				}
			}
		}, {
			observer: {
				'$elemMatch': {
					'$eq': req.user.username
				}
			}
		}
	]}, (err, data) => {
		if(err) {
			return res.status(500).json({
				message: err.message
			})
		}
		if(!data) {
			return res.status(403).json({
				message: 'Forbidden'
			});
		}

		RecordModel.find({id: params.id}).limit(limit).skip((page-1)*limit).sort({time: -1}).exec((err, data) => {
			if(err) {
				return res.status(500).json({
					message: err.message
				});
			}
			res.json({
				message: '',
				data: data
			});
		});

	});
});

module.exports = router;