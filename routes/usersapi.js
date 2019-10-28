const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require('express');
const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne({ email: req.body.email });

		if (user) return res.status(400).send("User already registered");

		user = new User(
			_.pick(req.body, ["firstname", "email", "password", "score", "isAdmin"])
		);
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
// let filtered = lodash.filter(active_events, { _id : user.event_id });
	// console.log(filtered);
		await user.save();
		const token = user.generateAuthToken();
		res
			.header("x-auth-token", token)
			.send(_.pick(user, ["_id", "firstname", "score", "email", "isAdmin"]));
	} catch (error) {
		res.status(500).json({ error: error.toString() });
	}
});
router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findByIdAndUpdate(req.params.id, { $set: { email: req.body.email, firstname: req.body.firstname } },
		{
			new: true
		}
	);

	if (!user)
		return res.status(404).send("The user with the given ID was not found.");

	res.send(user);
});

router.delete("/:id", async (req, res) => {
	const user = await User.findByIdAndRemove(req.params.id);

	if (!user)
		return res.status(404).send("The user with the given ID was not found.");

	res.send(user);
});

router.get("/", async (req, res) => {
	const users = await User.find().sort("name");
	res.send(users);
});


module.exports = router;
