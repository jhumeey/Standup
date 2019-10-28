const { Check_in } = require("../models/checkin");
const { Quiz } = require("../models/quiz");
const { User } = require("../models/users");
const redirectLogin = require("../middleware/redirectLogin");
const mongoose = require("mongoose");
const debug = require("mongoose").set("debug", true);
const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();


//CHECKIN ROUTE----------USER ROUTE
router.post("/", async (req, res) => {
	try{
		let checkin = new Check_in({
			user_id: req.body.user_id,
			event_id: req.body.event_id
		});
		checkin = await checkin.save();
		let user = await User.findByIdAndUpdate(req.body.user_id, { $push: { event_id: req.body.event_id } }, function (err) {
			if (err) {
				console.log(err);
			}
		});
		let quiz = await Quiz.findOne({ event_id: req.body.event_id });
		res.render("takequiz", { user, event_id: req.body.event_id, quiz });
		console.log(quiz)
	} catch(error){
		console.log(error.message);
	}
	
});

module.exports = router;
