define(function(require) {
	var app = require('helper/base');
	var Cover = require('widgets/cover');

	var Alert = Cover.FixedBase.extend({
		show: function(options) {
			if(options.msg) {
				this.$el.html(options.msg);
			}
			var timeout = options.timeout || 2000;
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
		},
		_show: function() {
			this.$el.show();
			// this.$el.css({
			// 	opacity: 0
			// });
		},
		_hide: function() {
			this.$el.removeClass('');
			this.$el.on('transitionend', () => {
				this.$el.hide();
			});
		}

	});

	Alert.ErrorAlert = Alert.extend({
		className: 'alert alert-danger animation'
	});

	return Alert;
});