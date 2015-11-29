define(function(require) {
	var app = require('base');
	var React = require('react');
	var ReactDom = require('react-dom');
	var UILoginBox = require('../components/loginBox');
	var UserModel = require('models/users');
	var SystemModel = require('models/system');

	var LoginAction = app.ActionView.extend({
		viewBeActive: function() {
			var view = this;

			this.reactLoginBox = ReactDom.render(React.createElement(UILoginBox, {
				onSubmit: function(username, password) {
					view.model.save({
						username: username,
						password: password
					}).done(function() {
						var afterLoginJump = SystemModel.singleton().get('afterLoginJump');
						if(!afterLoginJump || afterLoginJump.indexOf('#/auth') == 0) {
							location.hash = '/';
						} else {
							location.hash = afterLoginJump;
						}
					});
				}
			}), this.el);
		},
		viewWillRemoveStage: function(done) {
			this.reactLoginBox.setState({show: false});
			$(ReactDom.findDOMNode(this.reactLoginBox)).on('transitionend', done);
		},
		destroy: function() {
			this.reactLoginBox = null;
			this.model = null;
			this.el = this.$el = null;
		},
		initialize: function() {
			this.model = UserModel.singleton();
			if(this.model.isLogin()) {
				location.hash = '/';
			}
		}
	});

	var LogoutAction = app.ActionView.extend({
		initialize: function() {
			var user = UserModel.singleton();
			if(user.isLogin()) {
				user.destroy().done(() => {
					user.set('username', null);
					user.set('_id', null);
					location.hash = '#/auth';
				});
			} else {
				location.hash = '#/auth';
			}
		}
	});

	var Controller = app.ControllerView.extend({
		defaultAction: 'login',
		Actions: {
			'login': LoginAction,
			'logout': LogoutAction
		}
	});

	return Controller;
});