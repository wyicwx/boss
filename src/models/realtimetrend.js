define(function(require) {
	var app = require('base');

	var RealTimeTrend = app.BaseCollection.extend({
		url: '/api/trend/realtime',
		parse: function(rawData) {
			return rawData.data;
		}
	});

	return RealTimeTrend;
});