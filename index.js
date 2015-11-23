var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var passport = require('passport');
var app = express();

require('./components/db.js');
require('./components/passport.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./statics'));

app.use('/api', require('./api/api.js'));

app.listen(config.manager_port, function() {
	console.log('runing manager site on '+config.manager_port);
});

