requirejs.config({
	baseUrl: './js/',
	paths: {
		'base': './helper/base',
		'react': './vendors/react',
		'react-dom': './vendors/react-dom',
		'react-classnames': './vendors/react-classnames',
		'jquery': './vendors/jquery',
		'underscore': './vendors/underscore',
		'backbone': './vendors/backbone'
	}
});

define((require) => {
	var app = require('base');
	var Backbone = require('backbone');
	var UserModel = require('models/users');

	app.autoload = (model, callback) => {
		requirejs([model], function(Model) {
			callback(Model);
		});
	};

	app.AuthActionView = app.ActionView.extend({

	});

	app.mainView = new (app.MainView.extend({
		initialize: function() {
		}
	}));

	app.router = new app.Router({
		mainView: app.mainView,
		defaultController: 'auth',
		Controller: {
			'auth': 'controllers/authorization',
			'dashboard': 'controllers/dashboard'
		},
		initialize: function() {
			$('#main .w_progress').addClass('w_hide').on('transitionend', function() {
				$(this).remove();
			});
			UserModel.singleton().fetch().done(function() {
			}).always(function() {
				Backbone.history.start();
			});
		}
	});

	
});