define(function (require) {
	var React = require('react');
	var ReactClassnames = require('react-classnames');

	var TopBar = React.createClass({
		displayName: 'TopBar',

		getInitialState: function () {
			return {
				show: false
			};
		},
		componentDidMount: function () {},
		render: function () {
			var state = this.state;
			var NavClass = ReactClassnames({
				navbar: true,
				'navbar-static-top': true,
				'navbar-default': true,
				'navbar-fixed-top': true,
				w_navbar: true,
				w_hide: !state.show
			});
			return React.createElement(
				'nav',
				{ className: NavClass },
				React.createElement(
					'div',
					{ className: 'container-fluid' },
					React.createElement(
						'div',
						{ className: 'navbar-header' },
						React.createElement(
							'button',
							{ type: 'button', className: 'navbar-toggle collapsed', 'data-toggle': 'collapse', 'data-target': '#bs-example-navbar-collapse-1', 'aria-expanded': 'false' },
							React.createElement(
								'span',
								{ className: 'sr-only' },
								'Toggle navigation'
							),
							React.createElement('span', { className: 'icon-bar' }),
							React.createElement('span', { className: 'icon-bar' }),
							React.createElement('span', { className: 'icon-bar' })
						),
						React.createElement(
							'a',
							{ className: 'navbar-brand', href: '#' },
							'BOSS'
						)
					),
					React.createElement(
						'div',
						{ className: 'collapse navbar-collapse', id: 'bs-example-navbar-collapse-1' },
						React.createElement(
							'ul',
							{ className: 'nav navbar-nav' },
							React.createElement(
								'li',
								{ className: '' },
								React.createElement(
									'a',
									{ href: '#/table/my' },
									'My table',
									React.createElement(
										'span',
										{ className: 'sr-only' },
										'(current)'
									)
								)
							)
						),
						React.createElement(
							'ul',
							{ className: 'nav navbar-nav navbar-right' },
							React.createElement(
								'li',
								{ className: 'dropdown' },
								React.createElement(
									'a',
									{ href: 'javascript:void(0)', className: 'dropdown-toggle', 'data-toggle': 'dropdown', role: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
									this.props.username,
									React.createElement('span', { className: 'caret' })
								),
								React.createElement(
									'ul',
									{ className: 'dropdown-menu' },
									React.createElement(
										'li',
										null,
										React.createElement(
											'a',
											{ href: '#' },
											'Create table'
										)
									),
									React.createElement('li', { role: 'separator', className: 'divider' }),
									React.createElement(
										'li',
										null,
										React.createElement(
											'a',
											{ href: '#/auth/logout' },
											'Logout'
										)
									)
								)
							)
						)
					)
				)
			);
		}
	});

	return TopBar;
});
