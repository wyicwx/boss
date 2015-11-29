define(function(require) {
	var app = require('base');

	var Tables = app.BaseCollection.extend({
		url: '/api/tables',
		parse: function(rawData) {
			return rawData.data;
		}
	});

	return Tables;
});