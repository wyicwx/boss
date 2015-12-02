define(function (require) {
	var React = require('react');
	var ReactDom = require('react-dom');

	var LabelInput = React.createClass({
		displayName: 'LabelInput',

		getInitialState: function () {
			return {
				value: '',
				labels: []
			};
		},
		getDefaultProps: function () {
			return {
				type: 'text',
				placeholder: '',
				fixLabel: '',
				onChange: () => {}
			};
		},
		onChange: function (event) {
			var value = event.target.value;
			value = value.trim();
			if (value.match(/^[a-z0-9]*$/)) {
				this.setState({ 'value': value });
			}
		},
		onKeyDown: function (event) {
			var isChange = false;
			if ((event.keyCode == '13' || event.keyCode == '32') && this.state.value) {
				var labels = this.state.labels.concat([this.state.value]);
				labels = _.uniq(labels);
				this.setState({ labels: labels });
				this.setState({ 'value': '' });
				isChange = true;
			} else if (event.keyCode == '8') {
				if (!this.state.value && this.state.labels.length) {
					this.setState({ labels: this.state.labels.slice(0, -1) });
					isChange = true;
				}
			}
			if (isChange) {
				setTimeout(() => {
					this.props.onChange(this.state.labels);
				});
			}
		},
		onClick: function (event) {
			var labels = this.state.labels;

			labels = _(labels).without(event.target.text);
			this.setState({ labels: labels });
		},
		onBlur: function () {
			this.onKeyDown({
				keyCode: '13'
			});
		},
		render: function () {
			var state = this.state;
			var props = this.props;

			return React.createElement(
				'div',
				null,
				React.createElement(
					'label',
					{ className: 'form-control', style: { height: 'auto', cursor: 'text', 'paddingBottom': '3px' } },
					props.fixLabel ? React.createElement(
						'a',
						{ className: 'btn btn-success btn-xs mr5 mb5 disabled' },
						props.fixLabel
					) : '',
					state.labels.map((lb, key) => {
						return React.createElement(
							'a',
							{ key: key, className: 'btn btn-primary btn-xs mr5 mb5', onClick: this.onClick },
							lb
						);
					}),
					React.createElement('input', { className: 'mb5 vat', onBlur: this.onBlur, style: { border: 'none', outline: 'none', height: '22px' }, type: props.type, placeholder: props.placeholder, onChange: this.onChange, value: state.value, onKeyDown: this.onKeyDown })
				)
			);
		}
	});

	return LabelInput;
});
