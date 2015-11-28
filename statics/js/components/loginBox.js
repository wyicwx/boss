define(function (require) {
	var React = require('react');
	var ReactClassnames = require('react-classnames');
	var LoginInput = require('./loginInput');
	var LoginBox = React.createClass({
		displayName: 'LoginBox',

		getInitialState: function () {
			return {
				show: false,
				username: '',
				password: ''
			};
		},
		componentDidMount: function () {
			var view = this;
			setTimeout(function () {
				view.setState({ show: true });
			});
		},
		handleSubmit: function (event) {
			event.stopPropagation();
			event.preventDefault();
			return false;
		},
		render: function () {
			var state = this.state;
			var boxClass = ReactClassnames({
				w_loginBox: true,
				w_hide: !state.show
			});
			return React.createElement(
				'div',
				{ className: boxClass },
				React.createElement(
					'h1',
					{ className: 'mt0' },
					'Wellcome to BOSS.'
				),
				React.createElement(
					'form',
					{ className: 'mt30', onSubmit: this.handleSubmit },
					React.createElement(
						'div',
						{ className: 'mb20' },
						React.createElement(LoginInput, { type: 'text', placeholder: 'username' })
					),
					React.createElement(
						'div',
						{ className: 'mb20' },
						React.createElement(LoginInput, { type: 'password', placeholder: 'password' })
					),
					React.createElement(
						'div',
						{ className: 'tx_c' },
						React.createElement(
							'button',
							{ type: 'submit', className: 'btn btn-primary' },
							'登陆'
						)
					)
				)
			);
		}
	});

	return LoginBox;
});
