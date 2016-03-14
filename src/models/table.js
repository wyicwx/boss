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
			var error = {};

			if(!attrs.name) {
				error.name = 'name is required';
			}

			if(options.validateKey) {
				if(error[options.validateKey]) {
					return error;
				}
			} else {
				if(_.size(error)) {
					return error;
				}
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