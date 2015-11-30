define(function(require) {
	var app = require('base');
	var undef;


	var Table = app.BaseModel.extend({
		url: '/api/table',
		defaults: {
			name: undef,
			description: undef,
			owner: undef,
			observer: undef,
			struct: undef,
			token: undef,
			dimension: undef
		},
		idAttribute: '_id',
		parse: function(rawData) {
			if(_(rawData).has('data') && _(rawData).has('message')) {
				return rawData.data;
			} else {
				return rawData;
			}
		}
	});

	return Table;
});