define(function (require) {
	var React = require('react');
	var ReactClassnames = require('react-classnames');
	var LoginInput = React.createClass({
		displayName: 'LoginInput',

		getInitialState: function () {
			return {
				actived: false,
				value: ''
			};
		},
		onFocus: function () {
			this.setState({ actived: true });
		},
		onBlur: function () {
			if (this.state.value) {
				this.setState({ actived: true });
			} else {
				this.setState({ actived: false });
			}
		},
		onChange: function (event) {
			this.setState({ value: event.target.value });
		},
		render: function () {
			var props = this.props;
			var state = this.state;
			var boxClass = ReactClassnames({
				w_input: true,
				w_actived: state.actived
			});
			return React.createElement(
				'label',
				{ className: boxClass },
				React.createElement(
					'span',
					{ className: 'w_label' },
					props.placeholder
				),
				React.createElement('input', { type: props.type ? props.type : 'text', onFocus: this.onFocus, onBlur: this.onBlur, value: state.value, onChange: this.onChange })
			);
		}
	});

	return LoginInput;
});
