const redirectLogin = require("../middleware/redirectLogin");
const { Question } = require("../models/questions");
const express = require("express");
const { check } = require('express-validator');
let questionController = require('../controllers/question');
const router = express.Router();


//CREATE A QUESTION--------------------------ADMIN ROUTE
router.post("/createquestion/:id", [
	check('question').isLength({ min: 5 }),
	check('answers').isLength({ min: 5 }),
	check('correctAnswer').isLength({ min: 5 }),
], questionController.createQuestion);

// GET CREATE QUESTION PAGE-----------ADMIN ROUTE
router.get("/createquestion/:id", redirectLogin, questionController.getCreateQuestionPage);



//GET QUESTION BY ID----ADMIN ROUTE
router.get("/questions/:id", redirectLogin,questionController.getQuestionById);

//GET EDIT QUESTION ROUTE----ADMIN ROUTE
router.get("/edit/:id", redirectLogin, questionController.editQuestionPage);

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
	try {
		await Quiz.findByIdAndRemove(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
			res.redirect("/events/all");
		});
	} catch (error) {
		console.log(error.meassage);
	}
});

//ALL QUESTION BY QUIZ ID PAGE------ADMIN ROUTE
router.get("/question/:id", redirectLogin, async (req, res) => {
	try {
		let quizId = req.params.id;
		let query = { quiz_id: quizId };
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
