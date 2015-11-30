define(function (require) {
	var React = require('react');

	var TableList = React.createClass({
		displayName: "TableList",

		render: function () {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"h3",
					{ id: "tables" },
					"My table"
				),
				React.createElement(
					"table",
					{ className: "table table-bordered table-hover " },
					React.createElement(
						"thead",
						null,
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"table name"
							),
							React.createElement(
								"th",
								null,
								"owner"
							),
							React.createElement(
								"th",
								null,
								"create date"
							),
							React.createElement(
								"th",
								null,
								"opreate"
							)
						)
					),
					React.createElement(
						"tbody",
						null,
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								null,
								"1"
							),
							React.createElement(
								"td",
								null,
								"Column content"
							),
							React.createElement(
								"td",
								null,
								"Column content"
							),
							React.createElement(
								"td",
								null,
								"Column content"
							)
						)
					)
				)
			);
		}
	});

	return TableList;
});
