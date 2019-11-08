const { Check_in} = require("../models/checkin");
const { User } = require("../models/users");
const { Activity } = require("../models/activity");


exports.getAllCheckins = async (req, res) => {
    try {
        Check_in.aggregate(
            [
                // { "$match": { "_id": ObjectId(eventId) } },
                {
                    $lookup: {
                        from: "Activities",
                        localField: "_id",
                        foreignField: "event_id",
                        as: "activitydetails"
                    },
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "_id",
                        foreignField: "event_id",
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