requirejs.config({
	baseUrl: './js/',
	paths: {
		'text': './vendors/require-text',
		'base': './helper/base',
		'react': './vendors/react',
		'react-dom': './vendors/react-dom',
		'react-classnames': './vendors/react-classnames',
		'jquery': './vendors/jquery',
		'underscore': './vendors/underscore',
		'backbone': './vendors/backbone'
	}
});

define(function(require) {
	var app = require('base');
	var Backbone = require('backbone');
	var UserModel = require('models/users');
	var SystemModel = require('models/system');

	app.autoload = (model, callback) => {
		requirejs([model], (Model) => {
			callback(Model);
		});
	};


	app.AuthActionView = app.ActionView.extend({
		viewWillAddStage: function() {
			this._super();
			this.$el.addClass('w_pageanimate w_hide');
		},
		viewAddedStage: function() {
			this._super();
			setTimeout(() => {
				this.$el.removeClass('w_hide');
			}, 50);
		},
		viewBeActive: function() {
			this._super();
			setTimeout(() => {
				this.$el.removeClass('w_hide');
			}, 50);
		},
		viewBeInActive: function() {
			this.$el.addClass('w_hide');
		},
		constructor: function() {
			this._super();

			if(!UserModel.singleton().isLogin()) {
				SystemModel.singleton().set('afterLoginJump', location.hash);
				location.hash = '/auth';
				return false;
			}
		}
	});

	app.mainView = new (app.MainView.extend({
		el: '#main',
		renderTopBar: function(show) {
			if(!this.reactTopBar) {
				return requirejs(['components/topBar', 'react-dom', 'react'], (UITopBar, ReactDom, React) => {
					this.reactTopBar = ReactDom.render(React.createElement(UITopBar, {
						username: UserModel.singleton().get('username')
					}), document.getElementById('nav'));
					setTimeout(() => {
						this.renderTopBar(show);
					});
				});
			} else {
				this.reactTopBar.setState({show: show});
			}
		},
		initialize: function() {
			UserModel.singleton().on('change:_id', (model, username) => {
				this.renderTopBar(!!username);
			});
		}
	}));

	app.router = new app.Router({
		mainView: app.mainView,
		defaultController: 'dashboard',
		Controller: {
			'auth': 'controllers/authorization',
			'dashboard': 'controllers/dashboard',
			'table': 'controllers/table'
		},
		initialize: function() {
			$('#main .w_progress').addClass('w_hide').on('transitionend', function() {
				$(this).remove();
			});
		}
	});

	UserModel.singleton().fetch().always(function() {
		Backbone.history.start();
	});
});