const { Activity } = require("../models/activity");
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const router = express.Router();

// router.post("/create", 
// async (req, res) => {
// 		try {
// 			let quiz = new Quiz({
// 				title: req.body.title,
// 				user_id: req.body.user_id,
// 				event_id: req.body.event_id
// 			});
// 			console.log(quiz);
// 			quiz = await quiz.save();
// 			req.flash("success", { message: " Quiz created succesfully" });
// 			res.redirect(302, "/quiz/allquizzes");
// 		} catch (error) {
// 			console.log(error.message)
// 		}
// 	// }


// });


//GET ALL QUIZZES------ADMIN ROUTE
router.get("/all/", redirectLogin, async (req, res) => {
	try {
		const activities = await Activity.find().sort();
		res.render("activities", { activities });
	} catch (error) {
		console.log(error);
	}
});

//GET QUIZ BY ID-----ADMIN ROUTE
router.get("/view /:id", redirectLogin, async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.render("activity details", { activity });
	} catch (error) {
		console.log(error.message);
	}
});

router.get("/activity/create/:id/question", redirectLogin, async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.render("edit activity", { quiz });
	} catch (error) {
		console.log(error.message)
	}
});

//GET EDIT QUIZ-------ADMIN ROUTE
router.get("/activity/edit/:id", redirectLogin, async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.render("edit activity", { quiz });
	} catch (error) {
		console.log(error.message)
	}
});

//EDIT QUIZ--------ADMIN ROUTE
router.post("activity/edit/:id", async (req, res) => {
	const body = {
		name: req.body.name,
		description: req.body.description,
		activityType: req.body.activityType,
		event_id: req.body.event_id
	};
	await Activity.findByIdAndUpdate(req.params.id, body, function (err) {
		if (err) {
			req.flash("error", { message: " Sorry Cannot Edit Activity" });
			console.log(err);
		}
		req.flash("success", { message: " Quiz Edited Succesfully" });
		res.redirect("/activity/all/");
	});
});

//DELETE QUIZ-------ADMIN ROUTE
router.get("/delete/:id", redirectLogin, async (req, res) => {
	await Activity.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", { message: " Sorry Cannot Delete Quiz" });
			console.log(err);
		}
		req.flash("success", { message: " Quiz Deleted Succesfully" });
		res.redirect("/activity/all/");
	});
});

module.exports = router;
