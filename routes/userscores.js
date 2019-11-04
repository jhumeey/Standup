
const redirectLogin = require("../middleware/redirectLogin");

const express = require("express");
const router = express.Router();

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
