const { Event } = require("../models/event");
const { User } = require("../models/users");
const { Activity } = require("../models/activity");
const { Check_in } = require("../models/checkin");

const { eventValidationRules, validate } = require('../middleware/eventvalidator');
const { activityValidationRules, validateActivity } = require('../middleware/activityvalidator');
const redirectLogin = require("../middleware/redirectLogin");
// const auth = require("../middleware/auth");
// const lodash = require("lodash");
// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
//GET ALL EVENTS ROUTE---------ADMIN ROUTE
router.get("/events/all", redirectLogin, async (req, res) => {
	const events = await Event.find().sort();
	res.render("allevents", { events });
});
//CREATE EVENTS ROUTE------------- Admin ROUTE
router.post("/events", eventValidationRules(), validateActivity,
	async (req, res) => {
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
	});

//GET ACTIVE EVENTS----------USER ROUTE
router.get("/events", redirectLogin, async (req, res) => {
	let user = req.session.user;
	let userId = user._id;
	const userDetails = await User.findById(userId);
	const active_events = await Event.find({ status: "active" }).sort();
	console.log(active_events);
	res.render("events", { active_events, userDetails });
});

//CREATE EVENTS------ADMIN ROUTE
router.get("/events/create", redirectLogin, async (req, res) => {
	res.render("createevent", { user: req.session.user });
});


//GET EVENTS BY ID------ADMIN ROUTE
router.get("/events/:id", redirectLogin, async (req, res) => {
	try{
		const event = await Event.findById(req.params.id, function (err) {
			if (err) {
				console.log(err);
			}
		})
		res.render("eventdetails", { event });
	} catch(error){
		console.log(error.message)
	}

});

//GET EDIT EVENT ROUTE-------ADMIN ROUTE
router.get("/events/edit/:id", redirectLogin, async (req, res) => {
	try{
		const event = await Event.findById(req.params.id);
		res.render("editevent", { event });
	} catch(error){
		console.log(error.message)
	}

});

//POST EVENT ACTIVITIES ROUTE-------ADMIN ROUTE
router.post("/events/activity/:id/create", redirectLogin, activityValidationRules(), validate, async (req, res) => {
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
		res.redirect(302, "/events/all");

	} catch (error) {
		req.flash("error", { message: "Sorry, You cannot create an event" })
		res.redirect(302, "/event/activity/" + req.params.id + "/create");
		console.log(error.message);
	}


});
//GET EVENT ACTIVITIES ROUTE-------ADMIN ROUTE
router.get("/events/activity/:id/create", redirectLogin, async (req, res) => {
	let eventId = req.params.id;
	let activity = await Activity.find({ "activityType": { $exists: true } })
	try {
	res.render("create activity", { eventId, activity });

	} catch (error) {
		req.flash("error", { message: "Sorry, You cannot create an event" })
		res.redirect(302, "/event/activity/" + req.params.id + "/create");
		console.log(error.message);
	}


});

//GET EVENT ACTIVITIES ROUTE-------ADMIN ROUTE
router.get("/events/details/:id", redirectLogin, async (req, res) => {
	try {
		let eventId = req.params.id;
		let user = req.session.user;
		let userId = user._id;
		const userDetails = await User.findById(userId);
		const event = await Event.findOne({_id: eventId});
		const eventActivity = await Activity.find({event_id: eventId});
		console.log(eventActivity);
		res.render("event Info", { eventActivity, userDetails, event});

	} catch (error) {
		console.log(error.message);
	}


});

//CHECKIN ROUTE----------USER ROUTE
router.post("/events/checkin", async (req, res) => {
	try {
		let checkin = new Check_in({
			user_id: req.body.user_id,
			event_id: req.body.event_id
		});
		checkin = await checkin.save();
		let user = await User.findByIdAndUpdate(req.body.user_id, { $push: { event_id: req.body.event_id } });

		req.flash("success", { message: "Checked-in Sucessfully" });
		res.redirect("/events/details/"+ req.body.event_id);
	} catch (error) {
		console.log(error.message);
	}

});

router.get("/events/checkins",  async (req, res) => {
	try {
		Check_in.aggregate(
		[
			{
				$group:
				{
					_id: "$event_id",
					count: { $sum: 1 }
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user"
				}
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: [
							{ $arrayElemAt: ["$user", 0] }, "$$ROOT"
						]
					}
				}
			},
			{
				$project: {
					user: 0, password: 0, __v: 0
				}
			}
		], function (err, result) {
		
		}
		
	)

	} catch (error) {
		console.log(error.message);
	}


});




//EDIT EVENT-----ADMIN ROUTGE
router.post("/events/edit/:id", async (req, res) => {
	try{
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
	} catch(error){
		console.log(error.message)
	}
	
});

//DELETE EVENT ROUTE--------ADMIN ROUTE
router.get("/events/delete/:id", redirectLogin, async (req, res) => {
	await Event.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", { message: " Sorry Cannot Delete Event" });
		}
		req.flash("success", { message: " Event Deleted Succesfully" });
		res.redirect("/events/all");
	});
});



module.exports = router;
