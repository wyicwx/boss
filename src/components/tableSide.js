define(function (require) {
	var React = require('react');

	var TableList = React.createClass({
		displayName: 'TableList',

		getInitialState: function () {
			return {
				action: '',
				id: ''
			};
		},
		render: function () {
			var action = this.state.action;
			var id = this.state.id;
			return React.createElement(
				'div',
				{ classNam: 'list-group' },
				React.createElement(
					'a',
					{ className: action == 'detail' ? 'list-group-item active' : 'list-group-item', href: '#/table/detail/id/' + id },
					'Detail'
				),
				React.createElement(
					'a',
					{ className: action == 'realtime_trend' ? 'list-group-item active' : 'list-group-item', href: '#/table/realtime_trend/id/' + id },
					'Real-time trend'
				),
				React.createElement(
					'a',
					{ className: action == 'history_trend' ? 'list-group-item active' : 'list-group-item', href: '#/table/history_trend/id/' + id },
					'Histrical trend'
				),
				React.createElement(
					'a',
					{ className: action == 'realtime_data' ? 'list-group-item active' : 'list-group-item', href: '#/table/realtime_data/id/' + id },
					'Real-time data'
				),
				React.createElement(
					'a',
					{ className: action == 'realtime_analysis' ? 'list-group-item active' : 'list-group-item', href: '#/table/realtime_analysis/id/' + id },
					'Real-time data analysis'
				),
				React.createElement(
					'a',
					{ className: action == 'history_analysis' ? 'list-group-item active' : 'list-group-item', href: '#/table/history_analysis/id/' + id },
					'Histrical data analysis'
				)
			);
		}
	});

	return TableList;
});
