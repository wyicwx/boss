define(function(require) {
	var app = require('base');
	var TablesCollection = require('models/tables');

	var MyAction = app.AuthActionView.extend({
		renderList: function() {
			console.log(this.collection.toJSON());
		},
		initialize: function() {
			this.collection = TablesCollection.singleton();
			this.renderList = _.bind(this.renderList, this);
			this.collection.fetch();
			this.collection.on('sync', this.renderList);
		}
	});

	var Controller = app.ControllerView.extend({
		defaultAction: 'my',
		Actions: {
			'my': MyAction
		}	
	});

	return Controller;
});