define(function(require) {
	var React = require('react');
	var ReactClassnames = require('react-classnames');
	var LoginInput = require('./loginInput');
	var LoginBox = React.createClass({
		getInitialState: function() {
			return {
				show: false,
				username: '',
				password: ''
			};
		},
		componentDidMount: function() {
			var view = this;
			setTimeout(function() {
				view.setState({show: true});
			});
		},
		handleSubmit: function(event) {
			event.stopPropagation();
			event.preventDefault();
			return false;
		},
		render: function() {
			var state = this.state;
			var boxClass = ReactClassnames({
				w_loginBox: true,
				w_hide: !state.show
			});
			return (
				<div className={boxClass}>
					<h1 className="mt0">Wellcome to BOSS.</h1>
					<form className="mt30" onSubmit={this.handleSubmit} >
						<div className="mb20" >
							<LoginInput type="text" placeholder="username" />
						</div>
						<div className="mb20">
							<LoginInput type="password" placeholder="password" />
						</div>
						<div className="tx_c">
							<button type="submit" className="btn btn-primary">登陆</button>
						</div>
					</form>
				</div>
			);
		}
	});

	return LoginBox;
});