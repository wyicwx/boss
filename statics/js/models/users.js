define((require) => {
	var app = require('base');

	var User = app.BaseModel.extend({

		url: '/api/authorizations',
		parse: function(rawData) {
			return rawData.data;
		}
	});

	return User;
});