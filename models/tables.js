var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
	name: String,
	owner: Array,
	struct: Array,
	password: String
}, {
	collection: 'tables'
});

var tables = mongoose.model('tables', Schema);

module.exports = tables;