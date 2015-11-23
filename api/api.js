var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
	res.json({
		message: 'api index'
	});
});

router.use('/tables', require('./tables.js'));
router.use('/authorizations', require('./authorizations.js'));

module.exports = router;