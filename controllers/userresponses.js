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
    const questionIds = req.body.question_id;
    const answers = req.body.answer;
    const activity_id = req.body.activity_id;
    const activity_details = await Activity.find({ _id: activity_id });
    const activity_name = activity_details[0].name;
    const convertedIds = questionIds.map(s => mongoose.Types.ObjectId(s));
    let score = 0;
    const query = { _id: { $in: convertedIds } }
    const questions = await Question.find(query);
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].correctAnswer === answers[i]) {
            score = score + 10;
        } else {
            score = score;
        }
    }
    try {
        await Userscores.findOneAndUpdate({ user_id: req.session.user._id, activity_id: activity_id }, {$set: {score: score, activity_name: activity_name }}, { new: true }, function (err) {
            if (err) {
                console.log(err);
            }
            res.render("showscore", { score})
        });  
    } catch (error) {
        console.log(error);
    }
}