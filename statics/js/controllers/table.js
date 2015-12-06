define(function(require) {
	var app = require('base');
	var React = require('react');
	var ReactDom = require('react-dom');
	var TablesCollection = require('models/tables');
	var TableModel = require('models/table');
	var RecordsCollection = require('models/records');
	var UserModel = require('models/user');
	var Pagination = require('widgets/pagination');
	var RealTimeTrendModel = require('models/realtimetrend');

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

	var RealTimeDataAction = app.AuthActionView.extend({
		template: '<div class="list"></div><div class="pg col-lg-12"></div>',
		renderTable: function(data) {
			var tmpl = require('text!templates/controllers/table/realtime_data.html');
			var struct = data.table.sysStruct.concat(data.table.struct);
			var list = data.data;

			this.$('.list').html(_.template(tmpl)({
				struct: struct,
				list: list
			}));

			var limit = this.params.limit || 20;

			this.pagination.setup({
				page: this.params.page,
				total: Math.ceil(data.total / limit)
			});
		},
		renderPagination: function() {
			var view = this;

			this.pagination = new Pagination({
				className: 'pagination'
			});
			this.pagination.on('page', function(page) {
				var params = _.pick(view.params, ['id', 'limit', 'sort']);

				params.page = page;

				location.hash = '/table/realtime_data/'+_.flatten(_.pairs(params)).join('/');
			});
			this.$('.pg').append(this.pagination.$el);
		},
		viewBeActive: function(params) {
			this.model.fetch({
				data: {
					_id: params.id,
					page: params.page,
					limit: params.limit
				}
			}).done((data) => {
				this.renderTable(data);
			});
		},
		initialize: function() {
			this.$el.html(this.template);
			this.model = new RecordsCollection();
			this.renderPagination();
		}
	});

	var RealTimeTrendAction = app.AuthActionView.extend({
		renderChart: function() {
			var data = this.model.toJSON();
			var labels = [];
			var datas = [];
			_.each(data, function(item) {
				labels.push(item._id);
				datas.push(item.total);
			});
			requirejs(['Chart'], (Chart) => {
				var chart = new Chart(this.ctx);
				chart.Line({
					labels: labels,
					datasets: [{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : datas
					}]
				});
			});
		},
		viewBeActive: function(params) {
			this.model.fetch({
				data: {
					_id: params.id
				}
			}).done(() => {
				this.renderChart();
			});
		},
		initialize: function() {
			this.model = new RealTimeTrendModel();
			this.canvas = $('<canvas>');
			this.canvas.width('100%');
			this.canvas.css('background', 'white');
			this.ctx = this.canvas.get(0).getContext("2d");
			this.$el.append(this.canvas);
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
			'realtime_trend': RealTimeTrendAction,
			'history_trend': DetailAction,
			'realtime_data': RealTimeDataAction,
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