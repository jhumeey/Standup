const { Question } = require("../models/activity");
const { Quiz } = require("../models/quiz");
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const { check, validationResult } = require('express-validator');

const router = express.Router();

//VALIDATION MIDDLEWARE FOR POST ROUTE-----ADMIN ROUTE
const validate = [
	check('question').isLength({ min: 5 }),
	check('answers').isLength({ min: 5 }),
	check('correctAnswer').isLength({ min: 5 }),
];

//CREATE A QUESTION--------------------------ADMIN ROUTE
router.post("/createquestion/:id", async (req, res) => {
	try {
		let quizid = req.params.id;
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	console.log(json({ errors: errors.array() }));
		// }

		let question = new Question({
			event_id: req.body.event_id,
			quiz_id: req.body.quiz_id,
			question: req.body.question,
			answers: req.body.answers,
			correctAnswer: req.body.correctAnswer
		});
		question = await question.save();
		req.flash("success", { message: "Question created succesfully" });
		res.redirect("/activity/createquestion/" + req.body.quiz_id);
	} catch (error) {
		console.log( error.message);
	}
});

// GET CREATE QUESTION PAGE-----------ADMIN ROUTE
router.get("/createquestion/:id", redirectLogin, async (req, res) => {
	try {
		let quiz_id = req.params.id;
		let quiz = await Quiz.findById(req.params.id);
		let event_id = quiz.event_id;
		res.render("activity", { quiz_id, event_id });
	} catch(error){
		console.log("error", error.message);
	}
	
});



// //GET QUESTION BY ID----ADMIN ROUTE
// router.get("/questions/:id", redirectLogin, async (req, res) => {
// 	try{
// 		let query = { quiz_id: req.params.id };
// 		const question = await Question.find(query);
// 		let user = req.session.user;
// 		console.log(question);
// 		console.log(user);
// 		// res.send(question);
// 		res.render("startquiz", { question, quiz_id: req.params.id, user, clickHandler: "next();", startHandler: "start();", onchangeHandler: "onChange();" });

// 	} catch(error){
// 		console.log(error.message);
// 	}
// });

//GET EDIT QUESTION ROUTE----ADMIN ROUTE
// router.get("/edit/:id", redirectLogin, async (req, res) => {
// 	try{
// 		const question = await Question.findById(req.params.id, function (err) {
// 			if (err) {
// 				console.log(err);
// 			}
// 		});
// 		res.render("editquestion", { question });
// 	} catch(error){
// 		console.log(error.messaage)
// 	}
// });

// //EDIT QUESTION--------ADMIN ROUTE
// router.post("/edit/:id", validate, async (req, res) => {
// 	try{
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(422).json({ errors: errors.array() });
// 		}
// 		const body = {
// 			question: req.body.question,
// 			answers: req.body.answers,
// 			correctAnswer: req.body.correctAnswer
// 		};

// 		await Question.findByIdAndUpdate(req.params.id, body, function (err, question) {
// 			let quiz_id = question.quiz_id;
// 			if (err) {
// 				console.log(err);
// 			}
// 			req.flash("success", { message: "Question edited succesfully" });
// 			res.redirect("/activity/question/" + quiz_id);
// 		});
// 	} catch(error){
// 		console.log(error.message);
// 	}
// });

//DELETE QUESTION-----ADMIN ROUTE
router.get("/delete/:id", redirectLogin, async (req, res) => {
	try{
		await Quiz.findByIdAndRemove(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
			res.redirect("/events/all");
		});
	} catch(error){
		console.log(error.meassage);
	}
});

//ALL QUESTION BY QUIZ ID PAGE------ADMIN ROUTE
router.get("/question/:id", redirectLogin, async (req, res) => {
	try {
		let quizId = req.params.id;
		let query = {quiz_id: quizId};
		const questions = await Question.find(query).sort();
		res.render("questions", { questions });
	} catch (error) {
		console.log(error);
	}


});

//ALL QUESTION PAGE------ADMIN ROUTE
router.get("/questions/all", redirectLogin, async (req, res) => {
	try {
		const question = await Question.find().sort();
		res.render("questions", { question });
	} catch (error) {
		console.log(error);
	}


});
module.exports = router;
