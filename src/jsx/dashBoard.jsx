define(function(require) {
	var React = require('react');

	var DashBoard = React.createClass({
		render: function() {
			return (
				<div className="jumbotron">
					<div className="clearfix">
						<div className="col-lg-12">
							<h1>Hi, Boss.</h1>
							<h3>how about today?</h3>
						</div>
					</div>
				</div>
			);
		}
	});

	return DashBoard;
});