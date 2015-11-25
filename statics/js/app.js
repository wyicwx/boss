requirejs.config({
	baseUrl: './js/',
	paths: {
		'react': './vendors/react',
		'jquery': './vendors/jquery',
		'underscore': './vendors/underscore',
		'backbone': './vendors/backbone'
	}
});

define(['./js/helper/base.js', 'backbone'], (app, Backbone) => {
	app.autoload = (model, callback) => {
		debugger;
	};

	Backbone.history.start();
});