define(function(require) {
	var React = require('react');

	var TableList = React.createClass({
		getInitialState: function() {
			return {
				action: '',
				id: ''
			};
		},
		render: function() {
			var action = this.state.action;
			var id = this.state.id;
			return (
				<div classNam="list-group">
					<a className={action == 'detail' ? 'list-group-item active': 'list-group-item'} href={'#/table/detail/id/'+id}>Detail</a>
					<a className={action == 'realtime_trend' ? 'list-group-item active': 'list-group-item'} href={'#/table/realtime_trend/id/'+id}>Real-time trend</a>
					<a className={action == 'history_trend' ? 'list-group-item active': 'list-group-item'} href={'#/table/history_trend/id/'+id}>Histrical trend</a>
					<a className={action == 'realtime_data' ? 'list-group-item active': 'list-group-item'} href={'#/table/realtime_data/id/'+id}>Real-time data</a>
					<a className={action == 'realtime_analysis' ? 'list-group-item active': 'list-group-item'} href={'#/table/realtime_analysis/id/'+id}>Real-time data analysis</a>
					<a className={action == 'history_analysis' ? 'list-group-item active': 'list-group-item'} href={'#/table/history_analysis/id/'+id}>Histrical data analysis</a>
				</div>
			);
		}
	});


	return TableList;
});