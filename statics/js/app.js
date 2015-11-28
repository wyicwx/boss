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
	var React = require('react');
	var ReactDom = require('react-dom');
	var UserModel = require('models/users');

	app.autoload = (model, callback) => {
		requirejs([model], function(Model) {
			callback(Model);
		});
	};

	app.mainView = new (app.MainView.extend({
		initialize: function() {
			this.user = UserModel.singleton();
			this.user.on('sync', function() {
				// .fetch().done(function() {
				// 	debugger;
				// }).fail(function() {
				// 	requirejs(['./components/loginBox'], function(UILoginBox) {
				// 		ReactDom.render('');
				// 	});
				// });
			});
			this.user.fetch().done(function() {
				$('#main').html('');
				Backbone.history.start();
			}).fail(function() {
				requirejs(['./components/loginBox'], function(UILoginBox) {
					ReactDom.render(React.createElement(UILoginBox), $('#main')[0]);
				});
			});
			// this.user.set({
			// 	username: 'xiaofeng748',
			// 	password: '123456'
			// }).save();
		}
	}));

	app.router = new app.Router({
		mainView: app.mainView,
		defaultController: 'dashbord',
		Controller: {
			'dashboard': 'controller/dashboard'
		}
	});
});