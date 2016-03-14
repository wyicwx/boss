var webpack = require('webpack');


var compiler = webpack({
	context: __dirname+'/static/',
	output: {
		
	}
});

compiler.watch({
	aggregateTimeout: 300,
	poll: true
});