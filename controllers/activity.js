const { Activity } = require("../models/activity");
const { Question } = require("../models/questions");
const { Userscores } = require("../models/userscores");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.render("activities", { activities });
    } catch (error) {
        req.flash("error", { message: "Sorry, could not get activities" });
        res.redirect("/activity/all/");
    }
}
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        res.render("actvty details", { activity });
    } catch (error) {
        req.flash("error", { message: "Sorry, could not get activity" });
        res.redirect("/activity/all/");
    }
}
exports.startActivity = async (req, res) => {
    try {
        let activityId = req.params.id;
        let userId = req.session.user._id;
        let userscore = await Userscores.findOne({  $and: [{ user_id: userId }, { activity_id: activityId}] } );
        if (userscore) {
            req.flash("error", { message: "You have accessed this activity already" });
            res.redirect(301, "/activity/details/" + activityId);
        } else {
            let userscore = new Userscores({
                score: "0", user_id: userId, activity_id: activityId
            });
            userscore.save();
            Question.aggregate(
                [
                    { "$match": { "activity_id": ObjectId(activityId) } },
                    {
                        $lookup: {
                            from: "Activities",
                            localField: "activity_id",
                            foreignField: "_id",
                            as: "activitydetails"
                        },
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                $mergeObjects: [
                                    { $arrayElemAt: ["$activitydetails", 0] }, "$$ROOT"
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            __v: 0,
                        }
                    }
                ],
                function (err, questions) {
                    if (err) {
                        console.log(err.message)
                    }
                    res.render("startquiz", { questions })
                }
            )
        }

    } catch (error) {
        console.log(error.message);
    }
}
exports.viewActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        res.render("activity details", { activity });
    } catch (error) {
        console.log(error.message);
    }
}
exports.getCreateQuestionPageForActivity = async (req, res) => {
    try {
        let activityId = req.params.id;
        res.render("question", { activityId });
    } catch (error) {
        console.log(error.message)
    }
}
exports.CreateQuestionForActivity = async (req, res) => {
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
}
exports.getEditActivityPage = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        res.render("edit activity", { activity });
    } catch (error) {
        console.log(error.message)
    }
}
exports.viewActivityQuestion = async (req, res) => {
    try {
        const question = await Question.find({ activity_id: req.params.id });
        res.render("questions", { question });
    } catch (error) {
        console.log(error.message)
    }
}
exports.getEditActivityQuestionPage = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        res.render("editquestion", { question });
    } catch (error) {
        console.log(error.messaage)
    }
}
exports.editActivityQuestion = async (req, res) => {
    try {
        const body = {
            question: req.body.question,
            answers: req.body.answers,
            correctAnswer: req.body.correctAnswer
        };

        await Question.findByIdAndUpdate(req.params.id, body, function (err, question) {
            let activity_id = question.activity_id;
            if (err) {
                console.log(err);
            }
            req.flash("success", { message: "Question edited succesfully" });
            res.redirect("/activity/question/" + activity_id);
        });
    } catch (error) {
        console.log(error.message);
    }

}
exports.deleteActivityQuestion = async (req, res) => {
    await Question.findByIdAndRemove(req.params.id, function (err, question) {
        let activity_id = question.activity_id;
        if (err) {
            req.flash("error", { message: " Sorry Cannot Delete Question" });
            console.log(err);
        }
        req.flash("success", { message: " Question Deleted Succesfully" });
        res.redirect("/activity/question/" + activity_id);
    });
}
exports.editActivity = async (req, res) => {
    const body = {
        name: req.body.name,
        description: req.body.description,
        activityType: req.body.activityType,
        instructions: req.body.instructions,
        activity_id: req.body.activity_id
    };
    await Activity.findByIdAndUpdate(req.params.id, body, function (err) {
        if (err) {
            req.flash("error", { message: " Sorry Cannot Edit Activity" });
            console.log(err);
        }
        req.flash("success", { message: " Activity Edited Succesfully" });
        res.redirect("/events/all/");
    });
}
exports.deleteActivity = async (req, res) => {
    await Activity.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", { message: " Sorry Cannot Delete Activity" });
            console.log(err);
        }
        req.flash("success", { message: " Activity Deleted Succesfully" });
        res.redirect("/events/all/");
    });
}