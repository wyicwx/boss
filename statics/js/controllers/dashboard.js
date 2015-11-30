define(function(require) {
	var app = require('base');
	var React = require('react');
	var ReactDom = require('react-dom');
	var UserModel = require('models/users');
	var UIDashBoard = require('components/dashBoard');

	var IndexAction = app.AuthActionView.extend({
		mainTain: true,
		viewBeActive: function() {
			this._super();
		},
		initialize: function() {
			ReactDom.render(React.createElement(UIDashBoard), this.el);
		}
	});

	var Controller = app.ControllerView.extend({
		defaultAction: 'index',
		Actions: {
			'index': IndexAction
		}
	});

	return Controller;
});