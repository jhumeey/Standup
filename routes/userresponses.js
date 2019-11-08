// const { userValidationRules, validate } = require('../middleware/Userscorevalidator');
const redirectLogin = require("../middleware/redirectLogin");
let Userresponses = require("../controllers/userresponses");
const express = require("express");
const router = express.Router();

router.post("/", redirectLogin, Userresponses.submitUserresponses);
	module.exports = router;
