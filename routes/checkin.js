let checkinController = require('../controllers/checkin');
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const router = express.Router();

router.get("/checkins/all", redirectLogin, checkinController.getAllCheckins);

router.get("/checkins/usercheckins", redirectLogin, checkinController.getUserCheckins);

module.exports = router;