const { Activity } = require("../models/activity");
const { Question } = require("../models/questions");
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
router.get("/details/:id", redirectLogin, async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.render("actvty details", { activity });
	} catch (error) {
		console.log(error.message);
	}
});

router.get("/quiz/:id", redirectLogin, async (req, res) => {
	try {

		const activity = await Activity.findById(req.params.id)
		res.render("takequiz", { activity });
	} catch (error) {
		console.log(error.message);
	}
});

router.get("/startquiz/:id", redirectLogin, async (req, res) => {
	try {
		let activityId = req.params.id;
		const question = await Question.find({ activity_id: activityId });
		console.log(question);
		res.render("startquiz", { question});
	} catch (error) {
		console.log(error.message);
	}
});

//GET QUIZ BY ID-----ADMIN ROUTE
router.get("/view/:id", redirectLogin, async (req, res) => {
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

router.get("/create/:id/question", redirectLogin, async (req, res) => {
	try {
		let activityId = req.params.id;
		res.render("question", { activityId });
	} catch (error) {
		console.log(error.message)
	}
});

router.post("/create/:id/question", redirectLogin, async (req, res) => {
	try {
		let question = new Question({
			event_id: req.body.event_id,
			activity_id: req.body.activity_id,
			question: req.body.question,
			answers: req.body.answers,
			correctAnswer: req.body.correctAnswer
		});
		question = await question.save();
		req.flash("success", { message: "Question created succesfully" });
		res.redirect("/activity/createquestion/" + req.body.activity_id);
	} catch (error) {
		console.log(error.message)
	}
});

//GET EDIT QUIZ-------ADMIN ROUTE
router.get("/edit/:id", redirectLogin, async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.render("edit activity", { activity });
	} catch (error) {
		console.log(error.message)
	}
});

//EDIT QUIZ--------ADMIN ROUTE
router.post("/edit/:id", async (req, res) => {
	const body = {
		name: req.body.name,
		description: req.body.description,
		activityType: req.body.activityType,
		instructions: req.body.instructions,
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
