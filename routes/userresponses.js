const mongoose = require("mongoose");
const { Userresponses } = require("../models/userresponses");
const { Question } = require("../models/activity");
const { Userscores} = require("../models/userscores");
const { Quiz } = require("../models/quiz");
const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

router.post("/", async (req, res) => {
	let userId = req.session.user;
	let response = new Userresponses({

		question_id: req.body.question_id,
		user_id: userId,
		quiz_id: req.body.quiz_id,
		answer: req.body.answer,
		option: req.body.option,

	});
	response = await response.save();
	let questionIds = req.body.question_id;
	let answers = req.body.answer;
	let quiz_id = req.body.quiz_id;
	let quiz_details = await Quiz.find({_id: quiz_id});
	let quiz_title = quiz_details[0].title; 
	let convertedIds = questionIds.map(s => mongoose.Types.ObjectId(s));
	console.log(quiz_title);
	let score = 0;
	let query = { _id: { $in: convertedIds } }
	const questions = await Question.find(query);
	for (let i = 0; i < questions.length; i++) {
		if (questions[i].correctAnswer === answers[i]) {
			score = score + 10;
			console.log(score);

		} else {
			console.log("Wrong");
		}
	}
	try {
		let userscore = new Userscores({
			score: score,
			quiz_id: convertedIds[0],
			user_id: req.session.user._id,
			quiz_title : quiz_title
		});
		userscore = await userscore.save();
		res.render("showscore", { userscore })
	} catch (error) {
		console.log(error);
	}
});
	module.exports = router;
