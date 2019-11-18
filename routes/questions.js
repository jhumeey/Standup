const redirectLogin = require("../middleware/redirectLogin");
let questionValidation = require('../middleware/validator');
let questionController = require('../controllers/question');
const express = require("express");
const router = express.Router();

router.get("/createquestion/:id", redirectLogin, questionController.getCreateQuestionPage);

router.get("/questions/:id", redirectLogin, questionController.getQuestionById);

router.get("/edit/:id", redirectLogin, questionController.editQuestionPage);

router.post("/edit/:id", questionValidation.questionValidationRules(), questionValidation.validateQuestion, questionController.editQuestion);

router.get("/delete/:id", redirectLogin, questionController.deleteQuestion);

router.get("/question/:id", redirectLogin, questionController.getAllQuestions);

router.get("/questions/all", redirectLogin);

module.exports = router;
