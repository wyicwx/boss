define(function(require) {
	var app = require('base');


	var RecordsCollection = app.BaseCollection.extend({
		url: '/api/records',
		parse: function(rawData) {
			return rawData.data;
		}
	});

	return RecordsCollection;
});