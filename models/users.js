var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
	username: String,
	password: String
}, {
	collection: 'users',
	versionKey: false
});

var User = mongoose.model('users', Schema);

module.exports = User;