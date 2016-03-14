define(function(require) {
	var app = require('helper/base');

	var Pagination = app.BaseView.extend({
		template: require('text!templates/widgets/pagination.html'),
		className: 'w_navigation',
		events: {
			'click a[data-page]': function(e) {
				var target = $(e.currentTarget);
				var page = target.data('page');

				this.trigger('page', page);

				return false;
			}
		},
		setup: function(data) {
			var page = data.page || 1;
			var total = data.total || 0;

			page = Number(page);
			if(_.isNaN(page)) {
				page = 1;
			}

			if(total === 0) {
				this.$el.html('');
			} else {
				this.$el.html(_.template(this.template)({
					page: page,
					total: total,
					offset: 3
				}));
			}

		},
		initialize: function() {

		}
	});

	return Pagination;
});