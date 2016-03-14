define(function(require) {
	var app = require('helper/base');

	var Base = app.BaseView.extend({
		el: null,
		app: app,
		constructor: function(options) {
			options || (options = {});
			_.extend(this, _.pick(options, ['template']));
			this._super(options);
			if(options.name) {
				this.$el.data('name', options.name);
			}
			if(options.cover) {
				options.cover.register(this);
			} else {
				Cover.singleton().register(this);
			}
		},
		status: 0, // 1 show, 0 hide
		mask: false, // has mask
		maskClickHide: false, // click mask to hide
		show: function(options) {
			options || (options = {});

			this.status = 1;
			this.trigger('show', this);
			this._show();
		},
		_show: function() {
			this.$el.show();
		},
		hide: function(options) {
			options || (options = {});

			this.status = 0;
			if(!options.silent) {
				this.trigger('hide', this);
			}
			this._hide();
		},
		_hide: function() {
			this.$el.hide();
		},
		setElement: function(element, delegate) {
			var ret = this._super(element, delegate);
			if(this.template) {
				this.$el.html(_.result(this, 'template'));
			}
			return ret;
		},
		destroy: function() {
			if(this.status) {
				this.hide();
			}
			this.trigger('destroy', this);
			this.off();
		}
	});

	var PosCenterBase = Base.extend({
		show: function(options) {
			this._super(options);
			this.setPosCenter();
		},
		setPosCenter: function() {
			var width = this.$el.width();
			var height = this.$el.height();
			var wWdith = $(window).width();
			var wHeight = $(window).height();

			var left = (wWdith-width)/2;
			var top = (wHeight-height)/2 + $(window).scrollTop();
			if(top < 0) {
				top = 0;
			}
			this.$el.css({
				left: left,
				top: top
			});
		},
		setElement: function(element, delegate) {
			var ret = this._super(element, delegate);

			this.$el.css('position', 'absolute');

			return ret;
		}
	});

	var FixedBase = Base.extend({
		setElement: function(element, delegate) {
			var ret = this._super(element, delegate);

			this.$el.css('position', 'fixed');

			return ret;
		}
	});

	var FixedCenterBase = Base.extend({
		show: function(options) {
			this._super(options);
			this.setPosCenter();
		},
		setPosCenter: function() {
			var width = this.$el.width();
			var height = this.$el.height();
			var wWdith = $(window).width();
			var wHeight = $(window).height();

			var left = (wWdith-width)/2;
			var top = (wHeight-height)/2;
			if(top < 0) {
				top = 0;
			}
			this.$el.css({
				left: left,
				top: top
			});
		}
	});

	var Cover = app.BaseView.extend({
		zIndex: 2000,
		subview: null,
		className: 'w_cover',
		el: null,
		isHide: true,
		currentView: null,
		initialize: function() {
			var view = this;
			this.subview = [];
			this.mask = $('<div>').addClass('w_cover_mask');
			this.mask.css('position', 'relative');
			this.mask.on('click', function() {
				var currentView = view.currentView;
				
				if(currentView && currentView.mask && currentView.maskClickHide) {
					currentView.hide();
				} 
			});
			this.$el.append(this.mask);
			$(document.body).append(this.$el);
			$(window).on('resize', function() {
				if(!view.isHide) {
					view.resetPostionMask();
				}
				_.each(view.subview, function(view) {
					if(view instanceof PosCenterBase) {
						if(view.status === 1) {
							view.setPosCenter();
						}
					}
				});
			});
		},
		register: function(widget) {
			this.subview.push(widget);

			widget.on('hide', function(view) {
				this.checkHideStatus(view);
				this.adjustMaskIndex();
				this.checkCurrentView();
			}, this);

			widget.on('show', function(view) {
				this.showReady(view);
				this.adjustMaskIndex();
				this.checkCurrentView();
			}, this);

			widget.on('destroy', function(view) {
				debugger;
				this.adjustMaskIndex();
				this.checkCurrentView();
			}, this);

			this.$el.append(widget.$el);
		},
		checkCurrentView: function() {
			var maxIndex = 0;
			var maxView;
			_.each(this.subview, function(view) {
				if(view.status && view.zIndex >= maxIndex) {
					maxIndex = view.zIndex;
					maxView = view;
				}
			});

			if(maxIndex) {
				this.currentView = maxView;
			} else {
				this.currentView = null;
			}
		},
		adjustMaskIndex: function() {
			var maxIndex = 0;

			_.each(this.subview, function(view) {
				if(view.mask && view.status) {
					var index = view.zIndex;
					index = Number(index);

					if(!_.isNaN(index)) {
						if(index > maxIndex) {
							maxIndex = index;
						}
					}
				}
			});

			if(maxIndex) {
				this.mask.css('z-index', maxIndex-1);
			}
		},
		showReady: function(view) {

			// this.resetPosition();
			this.mask.hide();
			_.each(this.subview, function(view) {
				if(view.mask) {
					this.mask.show();
					this.resetPostionMask();
				}
			}, this);

			var zIndex = this.zIndex;

			this.$el.css('z-index', zIndex++);
			view.zIndex = zIndex;
			view.$el.css('z-index', zIndex++);
			this.$el.show();

			this.zIndex = zIndex;

			this.isHide = false;
		},
		resetPostionMask: function() {
			var width = $(document.body).width();
			var height = $(document.body).height();
			if(width == 0) {
				width = $(document.body).width();
			}
			this.mask.css({
				width: width,
				height: height
			});
		},
		resetPosition: function() {
			var scrollTop = $(window).scrollTop();
			this.$el.css('top', scrollTop);
			$('html').css('overflow-y', 'hidden');
		},
		checkHideStatus: function() {
			var toHide = true;
			_.each(this.subview, function(view) {
				if(view.status) {
					toHide = false;
				}
			}, this);

			if(toHide) {
				this.isHide = true;
				this.$el.hide();
			}
		},
		hideSub: function(except) {
			except = except || [];
			if(!_.isArray(except)) {
				except = [except];
			}
			_.each(this.subview, function(view) {
				if(!~_.indexOf(except, view.name)) {
					view.hide({silent: true});
				}
			});
		}
	}, {
		Base: Base,
		PosCenterBase: PosCenterBase,
		FixedCenterBase: FixedCenterBase,
		FixedBase: FixedBase
	});

	return Cover;
});