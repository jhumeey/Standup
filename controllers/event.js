const { Event } = require("../models/event");
const { User } = require("../models/users");
const { Activity } = require("../models/activity");
const { Activity_type } = require("../models/activitytype");
const { Check_in } = require("../models/checkin");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.getAllEvents = async (req, res) => {
	try{
		const events = await Event.find().sort();
		res.render("allevents", { events });
	}catch(error){
		req.flash("error", { message: "Sorry, could find the page you are looking for" })
		res.redirect(302, "/admin/dashboard");
		console.log(error);
	}
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
		console.log(error);
	}
}
exports.getActiveEvents = async (req, res) => {
	try {
		let user = req.session.user;
		let userId = user._id;
		const userDetails = await User.findById(userId);
		const active_events = await Event.find({ status: "active" }).sort();
		res.render("events", { active_events, userDetails });
	} catch (error) {
		console.log(error);
		req.flash("error", { message: "Sorry, could not find the page you are looking for" })
		res.redirect(302, "/users/login");
	}
}

exports.createEvent = async (req, res) => {
	try {
		res.render("createevent", { user: req.session.user });
	} catch (error) {
		req.flash("error", { message: "Sorry, could not find the page you are looking for" })
		res.redirect(302, "/events/all");
	}
}

exports.getEventByID = async (req, res) => {
	try {
		let event_id = req.params.id;
		Event.aggregate(
			[
				{ "$match": { "_id": ObjectId(event_id) } },
				{
					$lookup: {
						from: "Activities",
						localField: "_id",
						foreignField: "event_id",
						as: "eventactivities"
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: [
								{ $arrayElemAt: ["$eventactivities", 0] }, "$$ROOT"
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
			function (err, event) {
				if (err) {
					req.flash("error", { message: "Sorry cannot get event details" })
					res.redirect("/events/all")
				}
				res.render("eventdetails", { event })
			}
		)
	} catch (error) {
		console.log(error.message)
	}

}
exports.editEventPage = async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		res.render("editevent", { event });
	} catch (error) {
		console.log(error.message)
	}
}
exports.createActivityPage = async (req, res) => {
	try {
		let eventId = req.params.id;
		let activityTypes = await Activity_type.find({ "activity": { $exists: true } })
		res.render("create activity", { eventId, activityTypes });
	} catch (error) {
		req.flash("error", { message: "Sorry, You cannot create an event" })
		res.redirect(302, "/event/activity/" + req.params.id + "/create");
		console.log(error.message);
	}
}
exports.createEventActivity = async (req, res) => {
	let user_name = req.session.user.firstname;
	try {
		let activity = new Activity({
			name: req.body.name,
			description: req.body.description,
			activityType: req.body.activityType,
			instructions: req.body.instructions,
			createdBy: user_name,
			event_id: req.body.event_id
		});
		activity = await activity.save();
		req.flash("success", { message: "Activity Created Succesfully" })
		res.redirect(302, "/activity/all");
	} catch (error) {
		req.flash("error", { message: "Sorry, You cannot create an activity" })
		res.redirect(302, "/event/activity/" + req.params.id + "/create");
		console.log(error);
	}
}

exports.getEventDetails = async (req, res) => {
	try {
		let eventId = req.params.id;
		let user = req.session.user;
		let userId = user._id;
		let checkin_counter;
		const userDetails = await User.findById(userId);
		Check_in.aggregate(
			[
				{ $group: { _id: eventId, myCount: { $sum: 1 } } },
				{ $project: { _id: 0 } }
			],
			function (err, result) {
				if (err) {
					req.flash("error", { message: "Sorry Cannot get event details" })
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
				if (err) {
					req.flash("error", { message: "Sorry cannot get event details" })
					res.redirect("/events")
				}
				res.render("event Info", { eventDetails, userDetails, checkin_counter })
			}
		)
	} catch (error) {
		console.log(error);
		req.flash("error", { message: "Sorry could not find the page you are looking for" })
		res.redirect("/events")
	}


}
exports.createEventsCheckins = async (req, res) => {
	try {
		let checkin = new Check_in({
			user_id: req.body.user_id,
			event_id: req.body.event_id,
			checkin_Date: req.body.checkin_Date
		});
		checkin = await checkin.save();
		await User.findByIdAndUpdate(req.body.user_id, { $push: { event_id: req.body.event_id } });
		req.flash("success", { message: "Checked-in Sucessfully" });
		res.redirect(302, "/events/details/" + req.body.event_id);
	} catch (error) {
		console.log(error);
		req.flash("success", { message: "Sorry, Cannot complete request, please contact administrator" });
		res.redirect(302, "/events/details/" + req.body.event_id);
	}
}

exports.editEvent = async (req, res) => {
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
				res.redirect("/events/all");
				console.log(err);
			}
			req.flash("success", { message: "Event Edited Successfully" });
			res.redirect("/events/all");
		});
	} catch (error) {
		console.log(error)
	}
}
exports.deleteEvent = async (req, res) => {
	await Event.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", { message: " Sorry Cannot Delete Event" });
			res.redirect("/events/all");
		}
		req.flash("success", { message: " Event Deleted Succesfully" });
		res.redirect("/events/all");
	});
}