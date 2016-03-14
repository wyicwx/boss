define(function(require) {
	var app = require('base');
	var DateTool = require('helper/date');

	var Record = app.BaseModel.extend({
		parse: function(rawData) {
			rawData.timeFormat = DateTool.formatDate(rawData.time, 'yyyy-MM-dd hh:mm:ss');

			return rawData;
		}
	});

	var RecordsCollection = app.BaseCollection.extend({
		model: Record,
		url: '/api/records',
		parse: function(rawData) {
			return rawData.data;
		}
	});

	return RecordsCollection;
});