let activityController = require('../controllers/activity');
let Validation = require('../middleware/validator');
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
let router = express.Router();

router.get("/all/", redirectLogin, activityController.getAllActivities);

router.get("/details/:id", redirectLogin, activityController.getActivityById);

router.get("/startquiz/:id", redirectLogin, activityController.startActivity);

router.get("/view/:id", redirectLogin, activityController.viewActivity );

router.get("/createquestion/:id", redirectLogin, activityController.getCreateQuestionPageForActivity );

router.post("/createquestion/:id", redirectLogin, Validation.questionValidationRules(), Validation.validateQuestion, activityController.CreateQuestionForActivity );

router.get("/question/:id", redirectLogin, activityController.viewActivityQuestion );

router.get("/editquestion/:id", redirectLogin, activityController.getEditActivityQuestionPage);

router.post("/editquestion/:id", redirectLogin, Validation.questionValidationRules(), Validation.editValidateActivity , activityController.editActivityQuestion);

router.get("/deletequestion/:id", redirectLogin, activityController.deleteActivityQuestion);

router.post("/edit/:id", activityController.editActivity);

router.get("/edit/:id", activityController.getEditActivityPage);

router.get("/delete/:id", redirectLogin, activityController.deleteActivity);

module.exports = router;
