define(function (require) {
	var React = require('react');

	var DashBoard = React.createClass({
		displayName: "DashBoard",

		render: function () {
			return React.createElement(
				"div",
				{ className: "jumbotron" },
				React.createElement(
					"div",
					{ className: "clearfix" },
					React.createElement(
						"div",
						{ className: "col-lg-12" },
						React.createElement(
							"h1",
							null,
							"Hi, Boss."
						),
						React.createElement(
							"h3",
							null,
							"how about today?"
						)
					)
				)
			);
		}
	});

	return DashBoard;
});
