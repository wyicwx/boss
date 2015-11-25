/**
 * MVC framework based Backbone 
 * @description origin app 
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'underscore', 'backbone'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(exports, require('underscore'), require('backbone'));
    } else {
        // Browser globals
        factory((root.app = {}), root._, root.Backbone);
    }
}(this, function (exports, _, Backbone) {
    var app = exports;
	var singleton = function() {
		if(!this.__instache) {
			this.__instache = new this();
		}
		return this.__instache;
	};
	/**
	 * 自动加载函数，cmd/amd
	 * @abstract
	 */
	app.autoload = function(module, callback) {
		throw new Error('app.autoload is abstract function, override it.');
	};
	/**
	 * 扩展的View类，添加了ajax管理
	 */
	app.BaseView = Backbone.View.extend({
		app: app,
		constructor: function() {
			this.ajaxQueue = [];
			Backbone.View.apply(this, arguments);
		},
		ajax: function() {
			var view = this;
			var promise = Backbone.ajax.apply(this, arguments);

			if(!promise.abort) {
				throw new Error('');
			}
			promise.always(function() {
				var queue = view.ajaxQueue;
				var index = queue.indexOf(promise);
				queue.splice(index, 1);
			});
			this.ajaxQueue.push(promise);
			return promise;
		},
		abortAjaxQueue: function() {
			var view = this;
			_.each(view.ajaxQueue, function(promise) {
				if(promise && promise.abort) {
					promise.abort();
				}
			});
			this.ajaxQueue = [];
		}
	}, {
		singleton: singleton
	});

	app.BaseModel = Backbone.Model.extend({
		app: app
	}, {
		singleton: singleton
	});

	app.BaseCollection = Backbone.Collection.extend({
		app: app
	}, {
		singleton: singleton
	});

	app.MainView = app.BaseView.extend({
		el: document.body
	});

	app.ActionView = app.BaseView.extend({
		viewWillAddStage: function() {},
		viewAddedStage: function() {},
		viewBeActive: function() {},
		viewBeInActive: function() {}
	});

	app.TPActionView = app.ActionView.extend({
		viewWillRemoveStage: function() {},
		viewRemovedStage: function() {},
		destroy: function() {}
	});

	app.ControllerView = app.ActionView.extend({
		defaultAction: 'index',
		errorAction: null,
		Actions: {},
		activeParams: null,
		activeAction: null,
		prepareAction: function(action) {
			if(!action || !(action in this.Actions)) {
				action = this.errorAction || this.defaultAction;
			}
			if(!(action in this.actions)) {
				var ActionClass = this.Actions[action].extend({
					controller: this
				});
				this.actions[action] = new ActionClass();
				this.actions[action].$el.addClass(action+'Action');
			}
			return action;
		},
		runAction: function(action) {
			var activeActionInstance = this.actions[action];
			if(!activeActionInstance.onStage) {
				activeActionInstance.onStage = true;
				activeActionInstance.viewWillAddStage();
				this.$el.append(activeActionInstance.$el);
				activeActionInstance.viewAddedStage();
			}
		},
		dispath: function(action, rawParams) {
			var actionInstance = this.actions[action];

			this.activeParams = this.parseParams(rawParams);

			if(this.activeAction && this.activeAction != action && this.actions[this.activeAction]) {
				this.destroyAction(this.activeAction);
			}
			this.activeAction = action;
			actionInstance.$el.show();
			actionInstance.params = this.activeParams;
			actionInstance.viewBeActive(this.activeParams);
		},
		destroyAction: function(activeAction) {
			var controller = this;
			_.each(this.actions, function(action, name) {
				if(!activeAction || activeAction === name) {
					if(action.onStage) {
						action.onStage = false;
					}
					action.abortAjaxQueue();
					if(action instanceof app.TPActionView) {
						action.viewBeInActive();
						action.viewWillRemoveStage();
						action.$el.remove();
						action.viewRemovedStage();
						action.destroy();
						delete controller.actions[name];
					} else {
						action.$el.hide();
						action.viewBeInActive();
					}
				}

			});
		},
		constructor: function() {
			this.actions = {};
			app.ControllerView.__super__.constructor.apply(this, arguments);
		},
		parseParams: function(rawParams) {
			if(!rawParams) {
				return {};
			}
			// normalize
			rawParams.replace(/\/+/g, '\/');
			// split by /
			rawParams = rawParams.split('/');

			var keys = _.reject(rawParams, function(value, key){ return key % 2 == 1; });
			var values = _.reject(rawParams, function(value, key){ return key % 2 == 0; });

			return _.object(keys, values);
		},
		viewWillRemoveStage: function() {},
		viewRemovedStage: function() {}
	});

	/**
	 * router 控制controller行为
	 * controller 控制action行为
	 */
	app.Router = Backbone.Router.extend({
		app: app,
		routes: {
			'': 'router',
			':controller': 'router',
			':controller/:action': 'router',
			':controller/:action/*params': 'router'
		},
		previousController: null,
		activeController: null,
		previousAction: null,
		activeAction: null,
		rawParams: null,
		Controller: {},
		defaultController: 'index',
		errorController: null,
		mainView: null,
		/**
		 * 路由路口
		 * @description 
		 * 由url上取得controller、action
		 * -》解析controller是否存在，不存在则使用errorController，若无则defaultController
		 * -》
		 */
		router: function(controller, action, params) {
			params || (params = '');
			var rawParams;
			var router = this;

			if(!(controller in router.Controller)) {
				rawParams = _.compact([controller, action, params]).join('/');
				controller = router.errorController || router.defaultController;
			}

			router.prepareController(controller, function(controllerInstance) {
				var activeAction = controllerInstance.prepareAction(action);
				router.previousAction = router.activeAction;
				router.activeAction = activeAction;

				if(!rawParams) {
					if(activeAction != action) {
						rawParams = _.compact([action, params]).join('/');
					} else {
						rawParams = params;
					}
				}
				// 判断路由controller和当前controller是否一致
				if(controller != router.activeController) {
					if(router.activeController) {
						var preControllerInstance = router.controllers[router.activeController];
						preControllerInstance.destroyAction();
						if(!_.size(preControllerInstance.actions)) {
							preControllerInstance.viewWillRemoveStage();
							preControllerInstance.$el.remove();
							preControllerInstance.viewRemovedStage();
						} else {
							preControllerInstance.$el.hide();
						}
						router.previousAction = preControllerInstance.activeAction;
						router.previousController = router.activeController;
					}

					controllerInstance.viewWillAddStage();
					router.mainView.$el.append(controllerInstance.$el.show());
					controllerInstance.viewAddedStage();
				}
				router.activeController = controller;
				controllerInstance.runAction(activeAction);

				controllerInstance.viewBeActive();
				controllerInstance.dispath(activeAction, rawParams);
				router.trigger('router');
			});
		},
		prepareController: function(controller, callback) {
			var self = this;
			if(!(controller in this.controllers)) {
				app.autoload(this.Controller[controller], function(Controller) {
					var instance = self.controllers[controller] = Controller.singleton();
					instance.$el.addClass(controller+'Controller');
					callback(Controller.singleton());
				});
			} else {
				callback(this.controllers[controller]);
			}
		},
		constructor: function(args) {
			this.controllers = {};
			if(args) {
				_.extend(this, args);
			}
			app.Router.__super__.constructor.apply(this,arguments);
			if(!this.mainView) {
				throw new Error('Router.mainView is abstract property, override it.');
			}
		}
	});
}));