const eventController = require("../controllers/event");
const { eventValidationRules, validate } = require('../middleware/eventvalidator');
const { activityValidationRules, validateActivity } = require('../middleware/activityvalidator');
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const router = express.Router();

//GET ALL EVENTS ROUTE---------ADMIN ROUTE
router.get("/events/all", redirectLogin, eventController.getAllEvents );
//CREATE EVENTS ROUTE------------- Admin ROUTE
router.post("/events", eventValidationRules(), validateActivity, eventController.postCreateEvent);

//GET ACTIVE EVENTS----------USER ROUTE
router.get("/events", redirectLogin, eventController.getActiveEvents);

//CREATE EVENTS------ADMIN ROUTE
router.get("/events/create", redirectLogin, eventController.createEvent );


//GET EVENTS BY ID------ADMIN ROUTE
router.get("/events/:id", redirectLogin, eventController.getEventByID);

//GET EDIT EVENT ROUTE-------ADMIN ROUTE
router.get("/events/edit/:id", redirectLogin, eventController.editEvent );

//POST EVENT ACTIVITIES ROUTE-------ADMIN ROUTE
router.post("/events/activity/:id/create", redirectLogin, activityValidationRules(), validate, eventController.createEventActivity );
//GET EVENT ACTIVITIES ROUTE-------ADMIN ROUTE
router.get("/events/activity/:id/create", redirectLogin, eventController.createEventActivityPage);

//GET EVENT ACTIVITIES ROUTE-------ADMIN ROUTE
router.get("/events/details/:id", redirectLogin, eventController.getEventDetails);

//CHECKIN ROUTE----------USER ROUTE
router.post("/events/checkin", eventController.postEventsCheckins);

router.get("/events/checkins", eventController.getEventCheckins );




//EDIT EVENT-----ADMIN ROUTGE
router.post("/events/edit/:id", eventController.editEventByAdmin);

//DELETE EVENT ROUTE--------ADMIN ROUTE
router.get("/events/delete/:id", redirectLogin, eventController.deleteEvent);



module.exports = router;
