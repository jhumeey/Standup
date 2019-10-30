const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { Userscores, validate } = require("../models/userscores");
const redirectLogin = require("../middleware/redirectLogin");
const { Quiz } = require("../models/quiz");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

//CREATE USERRESPONSE----ADMIN ROUTE
router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		let userscores = new Userscores({
			score: req.body.score,
			event_id: req.body.event_id,
			event_title: req.body.event_title,
			dateTaken: req.body.dateTaken
		});
		userscores = await userscores.save();

		res.send(userscores);
	} catch (error) {
		res.status(500).json({ error: error.toString() });
	}
});

//GET USER SCORES---------USER ROUTE
router.get("/userscores", redirectLogin, async (req, res) => {
	try {
		let user = req.session.user;
		let query = { user_id: user._id };
		const userscore = await Userscores.find(query);
		res.render("userscores", { userscore, user });
	} catch (error) {
		console.log(error.message);
	}
});





module.exports = router;
