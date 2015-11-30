define(function(require) {
	var app = require('base');
	var React = require('react');
	var ReactDom = require('react-dom');
	var UITableList = require('components/tableList');
	var TablesCollection = require('models/tables');
	var TableModel = require('models/table');

	var MyAction = app.AuthActionView.extend({
		template: require('text!templates/controllers/table/my.html'),
		renderList: function() {
			var template = require('text!templates/controllers/table/table_list.html');

			this.$('.table_list').html(_.template(template)({lists: this.collection.toJSON()}));
		},
		initialize: function() {
			this.$el.html(this.template);
			this.collection = TablesCollection.singleton();
			this.renderList = _.bind(this.renderList, this);
			this.collection.fetch();
			this.collection.on('sync', this.renderList);
		}
	});

	var DetailAction = app.AuthActionView.extend({
		template: require('text!templates/controllers/table/detail.html'),
		renderDetail: function() {
			this.$el.html(_.template(this.template)({table: this.model.toJSON()}));
		},
		viewBeActive: function(params) {
			this._super();
			if(!params.id) {
				return location.hash = '#/table';
			}

			if(TablesCollection.singleton().get(params.id)) {
				this.model = TablesCollection.singleton().get(params.id);
				this.renderDetail();
			} else {
				this.model.fetch({
					data: {
						_id: params.id
					}
				}).done(() => {
					this.renderDetail();
				});
			}
		},
		initialize: function() {
			this.model = new TableModel();
		}
	});

	var Controller = app.ControllerView.extend({
		defaultAction: 'my',
		Actions: {
			'my': MyAction,
			'detail': DetailAction
		}	
	});

	return Controller;
});