var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
	// 表名
	name: {
		type: String,
		required: true
	},
	// 表描述
	description: String,
	// 所有者
	owner: {
		type: [String],
		index: true,
		required: true
	},
	// 观察者(无修改权限)
	observer: {
		type: [String],
		index: true
	},
	// 系统结构
	sysStruct: [String],
	// 用户自定义结构
	struct: [String],
	// 记录入表密码
	token: String,
	// 表纬度
	dimension: [String],
	// 创建时间
	createDate: {
		type: Date,
		default: Date.now()
	},
	// 修改时间
	modifyDate: {
		type: Date,
		default: Date.now()
	}
}, {
	collection: 'tables',
	versionKey: false
});

Schema.method('sample', function() {
	this.sysStruct = ['time', 'ip', 'op', 'id'];
});
var tables = mongoose.model('tables', Schema);

module.exports = tables;