var express = require('express');
var router = express.Router();
var TableModel = require('../models/tables.js');

router.get('/', (req, res, next) => {
	res.json({
		message: 'tables'
	});
});

module.exports = router;