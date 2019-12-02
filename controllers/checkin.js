const { Check_in} = require("../models/checkin");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;


exports.getAllCheckins = async (req, res) => {
    try {
        Check_in.aggregate(
            [
                {
                    $lookup: {
                        from: "Events",
                        localField: "event_id",
                        foreignField: "_id",
                        as: "eventdetails"
                    },
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "userdetails"
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                { $arrayElemAt: ["$eventdetails, userdetails", 0] }, "$$ROOT"
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
            function (err, checkins) {
                if (err) {
                    console.log(err)
                }
                res.render("allcheckins", { checkins });
            }
        )

    } catch (error) {
        console.log(error);
        req.flash("error", { message: "Sorry, Could not find the page you are looking for" });
        res.redirect("/admin/dashboard");
    }
}

exports.getUserCheckins = async (req, res) => {
    try {
        const user_id = req.session.user._id;
        Check_in.aggregate(
            [
                { "$match": { "user_id": ObjectId(user_id) } },
                {
                    $lookup: {
                        from: "Events",
                        localField: "event_id",
                        foreignField: "_id",
                        as: "eventdetails"
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                { $arrayElemAt: ["$eventdetails", 0] }, "$$ROOT"
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
            function (err, checkins) {
                if (err) {
                    console.log(err.message)
                }
                res.render("usercheckins", { checkins });
            }
        )

    } catch (error) {
        console.log(error.message);
    }


}