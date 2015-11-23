var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
	username: String,
	password: String
}, {
	collection: 'user'
});

var User = mongoose.model('user', Schema);

module.exports = User;