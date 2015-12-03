define(function(require) {
	var app = require('base');
	var React = require('react');
	var ReactDom = require('react-dom');
	var TablesCollection = require('models/tables');
	var TableModel = require('models/table');
	var RecordsCollection = require('models/records');
	var UserModel = require('models/user');

	var UITableSide = require('components/tableSide');
	var UILabelInput = require('components/labelInput');

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

			this.model.fetch({
				data: {
					_id: params.id
				}
			}).done(() => {
				this.renderDetail();
			});
		},
		initialize: function() {
			this.model = new TableModel();
		}
	});

	var TableFormAction = app.AuthActionView.extend({
		template: require('text!templates/controllers/table/create.html'),
		events: {
			'blur [data-name]': function(e) {
				var target = $(e.currentTarget);
				var name = target.data('name');
				var value = target.val();

				if(!this.model.set(name, value, {validate: true, validateKey: name})) {
					if(_.has(this.model.validationError, name)) {
						this.showInputError(name);
					}
				}
			},
			'focus [data-name]': function(e) {
				var target = $(e.currentTarget);
				target.closest('.form-group').removeClass('has-error');
			},
			'submit form': function(e) {
				if(!this.model.isValid()) {
					_.each(this.model.validationError, (msg, name) => {
						this.showInputError(name);
					});
				} else {
					this.model.save().done(function(data) {
						location.hash = '#/table/detail/id/'+data.data._id;
					});
				}

				return false;
			}
		},
		showInputError: function(name) {
			this.$('[data-name="'+name+'"]').closest('.form-group').addClass('has-error');
		},
		renderLabelInput: function() {
			this.reactOwner = ReactDom.render(React.createElement(UILabelInput, {
				placeholder: 'owner',
				onChange: (labels) => {
					this.model.set('owner', labels);
				},
				fixLabel: UserModel.singleton().get('username')
			}), this.$('#owner').get(0));

			this.reactObserver = ReactDom.render(React.createElement(UILabelInput, {
				placeholder: 'observer',
				onChange: (labels) => {
					this.model.set('observer', labels);
				}
			}), this.$('#observer').get(0));
		},
		viewBeActive: function(params) {
			this._super();

			if(app.router.activeAction == 'edit') {
				this.model.fetch({
					data: {
						_id: params.id
					}
				}).done((data) => {
					this.reactObserver.setState({labels: data.data.observer});
					this.reactOwner.setState({labels: data.data.owner});
					_.each(data.data, (value, key) => {
						this.$('[data-name="'+key+'"]').val(value);
					});
				});
			}

		},
		initialize: function() {
			this.model = new TableModel();
			this.$el.html(this.template);
			this.renderLabelInput();
		}
	});

	var RealTimeData = app.AuthActionView.extend({
		template: '<div class="table"></div><div class="navigation"></div>',
		renderTable: function(data) {
			var tmpl = require('text!templates/controllers/table/realtime_data.html');
			
			var struct = data.table.sysStruct.concat(data.table.struct);
			debugger;
		},
		viewBeActive: function(params) {
			this.model.fetch({
				data: {
					_id: params.id
				}
			}).done((data) => {
				this.renderTable(data);
			});
		},
		initialize: function() {
			this.model = new RecordsCollection();
		}
	});

	var Controller = app.ControllerView.extend({
		template: '<div class="p_side_page"><div class="p_side"></div><div class="p_page"></div></div>',
		defaultAction: 'my',
		appendAction: function(action) {
			this.$('.p_page').append(action.$el);
		},
		Actions: {
			'my': MyAction,
			'detail': DetailAction,
			'realtime_trend': DetailAction,
			'history_trend': DetailAction,
			'realtime_data': RealTimeData,
			'realtime_analysis': DetailAction,
			'history_analysis': DetailAction,
			'create': TableFormAction,
			'edit': TableFormAction
		},
		viewBeActive: function() {
			this.handleSideRouter();
		},
		destroy: function() {
			var isDestory = this._super();
			if(isDestory) {
				app.router.off('router', this.handleSideRouter);
			}
		},
		handleSideRouter: function() {
			var action = app.router.activeAction;
			var hasSideAction = ['detail', 'realtime_trend', 'history_trend', 'realtime_data', 'realtime_analysis', 'history_analysis'];

			if(_(hasSideAction).indexOf(action) != -1) {
				this.$('.p_side_page').addClass('p_open');
				this.reactTableSide.setState({
					'action': action,
					'id': this.activeParams.id
				});
			} else {
				this.$('.p_side_page').removeClass('p_open');
			}
		},
		initialize: function() {
			this.$el.html(this.template);
			this.reactTableSide = ReactDom.render(React.createElement(UITableSide), this.$('.p_side').get(0));
		}
	});

	return Controller;
});