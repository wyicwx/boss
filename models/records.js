var mongoose = require('mongoose');
var _ = require('lodash');
var TableModel = require('./tables.js');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Schema = new mongoose.Schema({
	// 时间
	time: Date,
	// 请求地址ip
	ip: String,
	// 操作符
	op: String,
	// 表id
	id: {
		type: ObjectId,
		required: true
	}
}, {
	collection: 'records',
	versionKey: false
});

Schema.method('record', (req, callback) => {
	callback || (callback = () => {});
	var params = _.extend({}, req.query, req.body);
	var model = new records(params);
	var error = model.validateSync();

	params.time = Date.now();
	params.ip = req.ip;
	if(error) {
		return callback(error);
	}

	TableModel.findOne({_id: params.id}, (err, data) => {
		if(err) {
			return callback(err);
		}
		if(!data) return;

		if(data.token) {
			if(params.token != data.token) {
				return callback({message: 'token error'});
			} else {
				delete params.token;
			}
		}

		var struct = data.sysStruct.concat(data.struct);
		var model = new records(_.pick(params, struct));
		
		model.save(callback);
	});
});

var records = mongoose.model('records', Schema);

module.exports = records;