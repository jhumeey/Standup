const { Event } = require("../models/event");
const { User } = require("../models/users");
const { Activity } = require("../models/activity");
const { eventValidationRules, validate } = require('../middleware/eventvalidator');
const { activityValidationRules, validateActivity } = require('../middleware/activityvalidator');
const redirectLogin = require("../middleware/redirectLogin");
// const auth = require("../middleware/auth");
// const lodash = require("lodash");
// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

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

//GET ALL EVENTS ROUTE---------ADMIN ROUTE
router.get("/events/all", redirectLogin, async (req, res) => {
	const events = await Event.find().sort();
	res.render("allevents", { events });
	console.log(events);
});

//GET EVENTS BY ID------ADMIN ROUTE
router.get("/events/:id", redirectLogin, async (req, res) => {
	const event = await Event.findById(req.params.id, function (err) {
		if (err) {
			console.log(err);
		}
	})
	res.render("eventdetails", { event });
});

//GET EDIT EVENT ROUTE-------ADMIN ROUTE
router.get("/events/edit/:id", redirectLogin, async (req, res) => {
	const event = await Event.findById(req.params.id, function (err) {
		if (err) {
			console.log(err);
		}
	});
	res.render("editevent", { event });
});

//POST EVENT ACTIVITIES ROUTE-------ADMIN ROUTE
router.post("/events/activity/:id/create", redirectLogin, activityValidationRules(), validate, async (req, res) => {
	try {
		let activity = new Activity({
			name: req.body.name,
			description: req.body.description,
			activityType: req.body.activityType,
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
	console.log(activity);
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
		res.render("event Info", { eventActivity, userDetails, event });

	} catch (error) {
		console.log(error.message);
	}


});

//EDIT EVENT-----ADMIN ROUTGE
router.post("/events/edit/:id", async (req, res) => {
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
});

//DELETE EVENT ROUTE--------ADMIN ROUTE
router.get("/events/delete/:id", redirectLogin, async (req, res) => {
	await Event.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", { message: " Sorry Cannot Delete Event" });
			console.log(err);
		}
		req.flash("success", { message: " Event Deleted Succesfully" });
		res.redirect("/events/all");
	});
});



module.exports = router;
