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
		validate: function(attrs, options) {
			debugger;
			if (attrs.end < attrs.start) {
				return "can't end before it starts";
			}
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