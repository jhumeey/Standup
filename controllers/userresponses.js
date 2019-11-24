const mongoose = require("mongoose");
const { Userresponses } = require("../models/userresponses");
const { Question } = require("../models/questions");
const { Userscores } = require("../models/userscores");
const { Activity } = require("../models/activity");

exports.submitUserresponses = async (req, res) => {
    let userId = req.session.user;
    let response = new Userresponses({

        question_id: req.body.question_id,
        user_id: userId,
        activity_id: req.body.activity_id,
        answer: req.body.answer

    });
    response = await response.save();
    let questionIds = req.body.question_id;
    console.log(questionIds)
    let answers = req.body.answer;
    let activity_id = req.body.activity_id;
    let activity_details = await Activity.find({ _id: activity_id });
    let activity_name = activity_details[0].name;
    let convertedIds = questionIds.map(s => mongoose.Types.ObjectId(s));
    let score = 0;
    let query = { _id: { $in: convertedIds } }
    const questions = await Question.find(query);
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].correctAnswer === answers[i]) {
            score = score + 10;
        } else {
            score = score;
        }
    }
    try {
        // let newscore = {
        //     score: score,
        //     activity_name: activity_name
        // }
        await Userscores.findOneAndUpdate({ user_id: req.session.user._id, activity_id: activity_id }, {$set: {score: score, activity_name: activity_name }}, { new: true }, function (err) {
            if (err) {
                console.log(err);
            }
            // console.log(newscore, score)
            res.render("showscore", { score})
        });  
    } catch (error) {
        console.log(error);
    }
}