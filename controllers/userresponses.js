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
        answer: req.body.answer,
        option: req.body.option,

    });
    response = await response.save();
    let questionIds = req.body.question_id;
    let answers = req.body.answer;
    let activity_id = req.body.activity_id;
    let activity_details = await Activity.find({ _id: activity_id[0] });
    let activity_name = activity_details[0].name;
    let convertedIds = questionIds.map(s => mongoose.Types.ObjectId(s));
    let score = 0;
    let query = { _id: { $in: convertedIds } }
    const questions = await Question.find(query);
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].correctAnswer === answers[i]) {
            score = score + 10;

        } else {
            console.log("Wrong");
        }
    }
    try {
        let userscore = {
            score: score,
            activity_id: convertedIds[0],
            user_id: req.session.user._id,
            activity_name: activity_name
        };
        userscore = await Userscores.findOneAndUpdate({ $and: [{ user_id: req.session.user._id }, { activity_id: activity_id }] } , userscore,  function (err) {
            if (err) {
                console.log(err);
            }
            res.render("showscore", { userscore })
        });
       
    } catch (error) {
        console.log(error);
    }
}