define(function(require) {
	var app = require('base');
	var React = require('react');
	var ReactDom = require('react-dom');
	var TablesCollection = require('models/tables');
	var TableModel = require('models/table');
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

	var CreateAction = app.AuthActionView.extend({
		template: require('text!templates/controllers/table/create.html'),
		events: {
			
		},
		renderLabelInput: function() {
			this.reactOwner = ReactDom.render(React.createElement(UILabelInput, {
				placeholder: 'owner',
				onChange: (labels) => {
					this.model.set('owner', labels.join(','));
				},
				fixLabel: UserModel.singleton().get('username')
			}), this.$('#owner').get(0));

			this.reactObserver = ReactDom.render(React.createElement(UILabelInput, {
				placeholder: 'observer',
				onChange: (labels) => {
					this.model.set('observer', labels.join(','));
				}
			}), this.$('#observer').get(0));
		},
		initialize: function() {
			this.model = new TableModel();
			this.$el.html(this.template);
			this.renderLabelInput();
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
			'realtime_data': DetailAction,
			'realtime_analysis': DetailAction,
			'history_analysis': DetailAction,
			'create': CreateAction
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