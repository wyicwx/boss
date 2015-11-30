var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
	if(req.user) {
		next();
	} else {
		if(req.path == '/authorizations' && req.method == 'POST') {
			return next();
		}
		if(req.path == '/') {
			return next();
		}
		res.status(401).json({
			message: 'Authorization fobidden'
		});
	}
});

router.get('/', (req, res) => {
	res.json({
		message: 'api index',
		apiList: [
			'/api',
			'/api/authorizations',
			'/api/records',
			'/api/tables',
			'/api/table'
		]
	});
});

router.use('/table', require('./table.js'));
router.use('/tables', require('./tables.js'));
router.use('/authorizations', require('./authorizations.js'));
router.use('/records', require('./records.js'));


module.exports = router;