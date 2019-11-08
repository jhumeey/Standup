const { Event } = require("../models/event");
const { User } = require("../models/users");
const { Activity } = require("../models/activity");
const { Check_in } = require("../models/checkin");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.getAllEvents = async (req, res) => {
    const events = await Event.find().sort();
    res.render("allevents", { events });
}
exports.postCreateEvent = async (req, res) => {
    try {
        let event = new Event({
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            activity: req.body.activity,
            eventDate: req.body.eventDate
        });
        event = await event.save();
        req.flash("success", { message: "Event Created Succesfully" })
        res.redirect(302, "/events/all");

    } catch (error) {
        req.flash("error", { message: "Sorry, You cannot create an event" })
        res.redirect(302, "/events/create");
        console.log(error.message);
    }
}
exports.getActiveEvents = async (req, res) => {
    let user = req.session.user;
    let userId = user._id;
    const userDetails = await User.findById(userId);
    const active_events = await Event.find({ status: "active" }).sort();
    res.render("events", { active_events, userDetails });
}

exports.createEvent = async (req, res) => {
    res.render("createevent", { user: req.session.user });
}

exports.getEventByID = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id, function (err) {
            if (err) {
                console.log(err);
            }
        })
        res.render("eventdetails", { event });
    } catch (error) {
        console.log(error.message)
    }

}
exports.editEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render("editevent", { event });
    } catch (error) {
        console.log(error.message)
    }

}
exports.createEventActivityPage = async (req, res) => {
    let eventId = req.params.id;
    let activity = await Activity.find({ "activityType": { $exists: true } })
    try {
        res.render("create activity", { eventId, activity });

    } catch (error) {
        req.flash("error", { message: "Sorry, You cannot create an event" })
        res.redirect(302, "/event/activity/" + req.params.id + "/create");
        console.log(error.message);
    }


}
exports.createEventActivity = async (req, res) => {
    try {
        let activity = new Activity({
            name: req.body.name,
            description: req.body.description,
            activityType: req.body.activityType,
            instructions: req.body.instructions,
            event_id: req.body.event_id
        });
        activity = await activity.save();
        req.flash("success", { message: "Activity Created Succesfully" })
        res.redirect(302, "/activity/all");

    } catch (error) {
        req.flash("error", { message: "Sorry, You cannot create an activity" })
        res.redirect(302, "/event/activity/" + req.params.id + "/create");
        console.log(error.message);
    }


}

exports.getEventDetails = async (req, res) => {
    try {
        let eventId = req.params.id;
        let user = req.session.user;
        let userId = user._id;
        let checkin_counter;
        const userDetails = await User.findById(userId);

        Check_in.aggregate([
            { $group: { _id: eventId, myCount: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ], function (err, result) {
            if(err){
                req.flash("error", {message: "Sorry Cannot get event details"})
                res.redirect("/eents");
            }
       checkin_counter = result;
        }
        )

        Event.aggregate(
            [
                { "$match": { "_id": ObjectId(eventId) } },
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
                        from: "Check_in",
                        localField: "_id",
                        foreignField: "event_id",
                        as: "checkindetails"
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
                if(err){
                    req.flash("error", {message: "Sorry cannot get event details"})
                    res.redirect("/events")
                }
                res.render("event Info", { eventDetails, userDetails, checkin_counter })
            }
        )
    } catch (error) {
        console.log(error.message);
    }


}
exports.postEventsCheckins = async (req, res) => {
    try {
        let checkin = new Check_in({
            user_id: req.body.user_id,
            event_id: req.body.event_id
        });
        checkin = await checkin.save();
        let user = await User.findByIdAndUpdate(req.body.user_id, { $push: { event_id: req.body.event_id } });

        req.flash("success", { message: "Checked-in Sucessfully" });
        res.redirect("/events/details/" + req.body.event_id);
    } catch (error) {
        console.log(error.message);
    }

}
exports.getEventCheckins = async (req, res) => {
    try {
        Check_in.aggregate(
            [
                { $group: { _id: null, myCount: { $sum: 1 } } },
                { $project: { _id: 0 } }
            ], function (err, result) {

            }

        )

    } catch (error) {
        console.log(error.message);
    }


}
exports.editEventByAdmin = async (req, res) => {
    try {
        const body = {
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            activity: req.body.activity,
            eventDate: req.body.eventDate
        };

        await Event.findByIdAndUpdate(req.params.id, body, function (err) {
            if (err) {
                req.flash("error", { message: " Sorry Cannot Edit Event" });
                console.log(err);
            }
            req.flash("success", { message: " Event Edited Successfully" });
            res.redirect("/events/all");
        });
    } catch (error) {
        console.log(error.message)
    }

}
exports.deleteEvent = async (req, res) => {
    await Event.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", { message: " Sorry Cannot Delete Event" });
        }
        req.flash("success", { message: " Event Deleted Succesfully" });
        res.redirect("/events/all");
    });
}