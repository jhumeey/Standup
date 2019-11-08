const { Check_in} = require("../models/checkin");
const { User } = require("../models/users");
const { Activity } = require("../models/activity");


exports.getAllCheckins = async (req, res) => {
    try {
        Check_in.aggregate(
            [
                {
                    $group:
                    {
                        _id: "$user_id",
                    }
                },
                {
                    $lookup: {
                        from: "Activities",
                        localField: "event_id",
                        foreignField: "event_id",
                        as: "activitydetails"
                    },
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "user_id",
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
            function (err, eventDetails) {
                console.log(eventDetails);
                res.render("event Info", { eventDetails, userDetails })
            }
        )




    } catch (error) {
        console.log(error.message);
    }


}