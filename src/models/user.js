define(function(require) {
	var app = require('base');
	var undef;

	var User = app.BaseModel.extend({
		defaults: {
			username: undef
		},
		idAttribute: '_id',
		url: '/api/authorizations',
		parse: function(rawData) {
			return rawData.data;
		},
		isLogin: function() {
			return this.get('username') != undef
		}
	});

	return User;
});