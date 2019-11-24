const eventController = require("../controllers/event");
const Validation = require("../middleware/validator");
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const router = express.Router();

router.get("/events/all", redirectLogin, eventController.getAllEvents );

router.post("/events", Validation.eventValidationRules(), Validation.validateEvent, eventController.postCreateEvent);

router.get("/events", redirectLogin, eventController.getActiveEvents);

router.get("/events/create", redirectLogin, eventController.createEvent );

router.get("/events/:id", redirectLogin, eventController.getEventByID);

router.get("/events/edit/:id", redirectLogin, eventController.editEventPage );

router.post("/events/activity/:id/create", redirectLogin, Validation.activityValidationRules(), Validation.validateActivity, eventController.createEventActivity );

router.get("/events/activity/:id/create", redirectLogin, eventController.createActivityPage);

router.get("/events/details/:id", redirectLogin, eventController.getEventDetails);

router.post("/events/checkin", eventController.createEventsCheckins);

router.post("/events/edit/:id",  Validation.eventValidationRules(), Validation.editValidateEvent, eventController.editEvent);

router.get("/events/delete/:id", redirectLogin, eventController.deleteEvent);

module.exports = router;
