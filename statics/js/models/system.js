define(function(require) {
	var app = require('base');
	var undef;

	var System = app.BaseModel.extend({
		defaults: {
			afterLoginJump: undef
		}
	});

	return System;
});