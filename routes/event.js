const { Event } = require("../models/event");
const { User } = require("../models/users");
const { check, validationResult } = require('express-validator');
const redirectLogin = require("../middleware/redirectLogin");
// const auth = require("../middleware/auth");
// const lodash = require("lodash");
// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//CREATE EVENTS ROUTE------------- Admin ROUTE
router.post("/events",
	[
		check('name').isLength({ min: 4 }).withMessage("Name must be a minimum of 4 characters "),
		check('description').isLength({ min: 4 }).withMessage("Description must be a  minimum of 4 characters"),
		check('status').isLength({ min: 4 }).withMessage("Status must be a  minimum of 4 characters"),
		check('activity').isLength({ min: 4 }).withMessage("Activity must be a  minimum of 4 characters"),
		check('eventDate').isLength({ min: 4 }).withMessage("Event Date must be a  minimum of 4 characters"),
	],
	async (req, res) => {
		try {
			req.errors = validationResult(req).errors;
			if (req.errors) {
				console.log(req.errors)
				for (i = 0; i < req.errors.length; i++) {
					req.flash("error", { message: req.errors[i].msg })
				}
				res.redirect("/events/create");
			} else {
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


			}
		} catch (error) {
			req.flash("error", { message: "Sorry, You cannot create an event" })
			res.redirect(302, "/events/all");
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
