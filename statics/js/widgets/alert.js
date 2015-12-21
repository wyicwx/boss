define(function(require) {
	var app = require('helper/base');
	var Cover = require('widgets/cover');

	var Alert = Cover.FixedBase.extend({
		show: function(options) {
			if(options.msg) {
				this.$el.html(options.msg);
			}
			var timeout = options.timeout || 3000;
			this._super(options);
			this.setPosition();

			setTimeout(() => {
				this.hide();
				this.$el.on('transitionend', () => {
					this.destroy();
				});
			}, timeout);
		},
		setPosition: function() {
			var width = this.$el.width();

			this.$el.css({
				top: 40,
				left: '50%',
				marginLeft: -width/2
			});
		}
	});

	Alert.ErrorAlert = Alert.extend({
		className: 'alert alert-danger'
	});

	return Alert;
});