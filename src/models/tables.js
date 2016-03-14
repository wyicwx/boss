define(function(require) {
	var app = require('base');
	var Table = require('./table');

	var Tables = app.BaseCollection.extend({
		url: '/api/tables',
		model: Table,
		parse: function(rawData) {
			return rawData.data;
		}
	});

	return Tables;
});