define(function(require) {
	var app = require('base');
	var undef;

	var User = app.BaseModel.extend({
		defaults: {
			username: undef
		},
		url: '/api/authorizations',
		parse: function(rawData) {
			return rawData.data;
		}
	});

	return User;
});