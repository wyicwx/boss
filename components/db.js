var mongoose = require('mongoose');
var config = require('../config.js');

var db = mongoose.connect('mongodb://'+config.db_host+':'+config.db_port+'/'+config.db_name, {
	username: config.db_username,
	password: config.db_password
});


module.exports = db;