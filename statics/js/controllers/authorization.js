define(function(require) {
	var app = require('base');
	var React = require('react');
	var ReactDom = require('react-dom');
	var UILoginBox = require('../components/loginBox');
	var UserModel = require('models/users');

	var LoginAction = app.ActionView.extend({
		initialize: function() {
		}
	});

	var Controller = app.ControllerView.extend({
		defaultAction: 'login',
		Actions: {
			'login': LoginAction
		},
		viewBeActive: function() {
			var view = this;

			ReactDom.render(React.createElement(UILoginBox, {
				onSubmit: function(username, password) {
					view.model.save({
						username: username,
						password: password
					}).always(function() {
						location.href = '#';
					});
				}
			}), this.el);
		},
		initialize: function() {
			this.model = UserModel.singleton();
		}
	});

	return Controller;
});