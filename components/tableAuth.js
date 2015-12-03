var TableModel = require('../models/tables.js');
var _ = require('lodash');

module.exports = function(req, res, callback) {
	var _id = req.params._id || req.query._id || req.body._id;

	TableModel.findOne({_id: _id, '$or': [
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

		var isOwner = _(data.owner).indexOf(req.user.username) != -1;

		callback && callback({
			data: data,
			isOwner: isOwner
		});
	});
};
