const { Activity } = require("../models/activity");
const { Question } = require("../models/questions");
const { Userscores } = require("../models/userscores");
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const router = express.Router();



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
		const userscore = await Userscores.find({activity_id: req.params.id})
		const activity = await Activity.findById(req.params.id);
		res.render("actvty details", { activity, userscore });
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
		res.render("startquiz", { question});
	} catch (error) {
		console.log(error.message);
	}
});

//GET QUIZ BY ID-----ADMIN ROUTE
router.get("/view/:id", redirectLogin, async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id);
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
		const activity = await Activity.findById(req.params.id);
		res.render("edit activity", { activity });
	} catch (error) {
		console.log(error.message)
	}
});
//GET EDIT QUIZ-------ADMIN ROUTE
router.get("/question/:id", redirectLogin, async (req, res) => {
	try {
		const question = await Question.find({ activity_id: req.params.id});
		res.render("questions", { question });
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
