define(function(require) {
	var React = require('react');
	var ReactClassnames = require('react-classnames');

	var TopBar = React.createClass({
		getInitialState: function() {
			return {
				show: false
			};
		},
		componentDidMount: function() {

		},
		render: function() {
			var state = this.state;
			var NavClass = ReactClassnames({
				navbar: true,
				'navbar-static-top': true,
				'navbar-default': true,
				'navbar-fixed-top': true,
				w_navbar: true,
				w_hide: !state.show
			});
			return (
				<nav className={NavClass}>
					<div className="container-fluid">
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className="navbar-brand" href="#">BOSS</a>
						</div>
						<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
							<ul className="nav navbar-nav">
								<li className="">
									<a href="#/table/my">
										My table
										<span className="sr-only">(current)</span>
									</a>
								</li>
							</ul>
							<ul className="nav navbar-nav navbar-right">
								<li className="dropdown">
									<a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
										{this.props.username}
										<span className="caret"></span>
									</a>
									<ul className="dropdown-menu">
										<li>
											<a href="#">Create table</a>
										</li>
										<li role="separator" className="divider"></li>
										<li>
											<a href="#/auth/logout">Logout</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			);
		}
	});

	return TopBar;
});