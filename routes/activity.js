const express = require("express");
let router = express.Router();
let activityController = require('../controllers/activity');
let Validation = require('../middleware/validator');
const redirectLogin = require("../middleware/redirectLogin");


//GET ALL ACTIVITIES------ADMIN ROUTE
router.get("/all/", redirectLogin, activityController.getAllActivities);

//GET ACTIVITY BY ID-----ADMIN ROUTE
router.get("/details/:id", redirectLogin, activityController.getActivityById);

//START ACTIVITY BY USER.......
router.get("/startquiz/:id", redirectLogin, activityController.startActivity);

//VIEW  ACTIVITY-----ADMIN ROUTE
router.get("/view/:id", redirectLogin, activityController.viewActivity );

//CREATE QUESTION PAGE FOR ACTIVITY-----ADMIN ROUTE
router.get("/createquestion/:id", redirectLogin, activityController.getCreateQuestionPageForActivity );

//POST CREATE QUESTION FOR ACTIVITY----ADMIN ROUTE
router.post("/createquestion/:id", redirectLogin, Validation.questionValidationRules(), Validation.validateQuestion, activityController.CreateQuestionForActivity );

//GET EDIT ACTIVITY PAGE-------ADMIN ROUTE
router.get("/edit/:id", redirectLogin, activityController.getEditActivityPage );

//VIEW ACTIVITY'S QUESTIONS------ADMIN ROUTE
router.get("/question/:id", redirectLogin, activityController.viewActivityQuestion );

// GET EDIT ACTIVITY'S QUESTION- PAGE --ADMIN ROUTE
router.get("/editquestion/:id", redirectLogin, activityController.getEditActivityQuestionPage);

//POST EDIT ACTIVITY'S QUESTION ----ADMIN ROUTE
router.post("/editquestion/:id", redirectLogin, Validation.questionValidationRules(), Validation.editValidateActivity , activityController.editActivityQuestion);

//DELETE ACTIVITY'S QUESTION-------ADMIN ROUTE
router.get("/deletequestion/:id", redirectLogin, activityController.deleteActivityQuestion);


//EDIT ACTIVITY--------ADMIN ROUTE
router.post("/edit/:id", activityController.editActivity);

//DELETE ACTIVITY-------ADMIN ROUTE
router.get("/delete/:id", redirectLogin, activityController.deleteActivity);

module.exports = router;
