const { Question } = require("../models/activity");
const { Activity} = require("../models/activity");
const { validationResult } = require('express-validator');

exports.createQuestion = async (req, res) => {
    try {
        let quizid = req.params.id;
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
        console.log(error.message);
    }
}

exports.getCreateQuestionPage = async (req, res) => {
    try {
        let quiz_id = req.params.id;
        let quiz = await Quiz.findById(req.params.id);
        let event_id = quiz.event_id;
        res.render("activity", { quiz_id, event_id });
    } catch (error) {
        console.log("error", error.message);
    }

}
exports.getQuestionById = async (req, res) => {
    try {
        let query = { quiz_id: req.params.id };
        const question = await Question.find(query);
        let user = req.session.user;
        console.log(question);
        console.log(user);
        // res.send(question);
        res.render("startquiz", { question, quiz_id: req.params.id, user, clickHandler: "next();", startHandler: "start();", onchangeHandler: "onChange();" });

    } catch (error) {
        console.log(error.message);
    }
}
exports.editQuestionPage = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id, function (err) {
            if (err) {
                console.log(err);
            }
        });
        res.render("editquestion", { question });
    } catch (error) {
        console.log(error.messaage)
    }
}