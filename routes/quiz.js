const { Quiz } = require("../models/quiz");
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

//CREATE A NEW QUIZ ROUTE-----ADMIN ROUTE
router.get("/create/quiz/:id", redirectLogin, async (req, res) => {
	try {
		let user = req.session.user;
		let event_id = req.params.id;
		res.render("quiz", { user, event_id });
	} catch (error) {
		// req.flash("error", { message: "Sorry cannot get all quizzes" })
		console.log(error);
	}
});

router.post("/create",
//  [
// 	check('title').isLength({ min: 4 }),
// ], 
async (req, res) => {
	req.errors = validationResult(req).errors;
	// if (req.errors) {
    //    console.log(req.errors)
	// 		req.flash("error", { message: req.errors.msg })
	// 	res.redirect("/quiz/allquizzes");
	// } else {
		try {
			let quiz = new Quiz({
				title: req.body.title,
				user_id: req.body.user_id,
				event_id: req.body.event_id
			});
			console.log(quiz);
			quiz = await quiz.save();
			req.flash("success", { message: " Quiz created succesfully" });
			res.redirect(302, "/quiz/allquizzes");
		} catch (error) {
			console.log(error.message)
		}
	// }


});


//GET ALL QUIZZES------ADMIN ROUTE
router.get("/allquizzes", redirectLogin, async (req, res) => {
	console.log("get all quizzzzzzz");
	try {
		const quizzes = await Quiz.find().sort();
		res.render("quizzes", { quizzes });
	} catch (error) {
		// req.flash("error", { message: "Sorry cannot get all quizzes" })
		console.log(error);
	}
});

//GET QUIZ BY ID-----ADMIN ROUTE
router.get("view/:id", redirectLogin, async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.render("quizdetails", { quiz });
	} catch (error) {
		console.log(error.message);
	}
});

// //VIEW QUIZ-------ADMIN ROUTE
// router.get("/create/:id", redirectLogin, async (req, res) => {
// 	try {
// 		let user = req.session.user;
// 		let id = req.params.id;
// 		res.render("quiz", { user, id });
// 	} catch (error) {
// 		console.log(error.message);
// 	}
// });


//GET EDIT QUIZ-------ADMIN ROUTE
router.get("/edit/:id", redirectLogin, async (req, res) => {
	try {
		const quiz = await Quiz.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.render("editquiz", { quiz });
	} catch (error) {
		console.log(error.message)
	}
});

//EDIT QUIZ--------ADMIN ROUTE
router.post("/edit/:id", async (req, res) => {
	const body = {
		title: req.body.title
	};
	await Event.findByIdAndUpdate(req.params.id, body, function (err) {
		if (err) {
			req.flash("error", { message: " Sorry Cannot Edit Quiz" });
			console.log(err);
		}
		req.flash("success", { message: " Quiz Edited Succesfully" });
		res.redirect("/quiz/all/quizzes");
	});
});

//DELETE QUIZ-------ADMIN ROUTE
router.get("/delete/:id", redirectLogin, async (req, res) => {
	await Event.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", { message: " Sorry Cannot Delete Quiz" });
			console.log(err);
		}
		req.flash("success", { message: " Quiz Deleted Succesfully" });
		res.redirect("/quiz/all/quizzes");
	});
});

module.exports = router;
