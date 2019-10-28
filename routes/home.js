const express = require('express');
const router = express.Router();


//HOMEPAGE
router.get('/', function (req, res) {
	console.log(req.session);
	res.render('index');
});

module.exports = router;
