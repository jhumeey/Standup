const redirectLogin = require("../middleware/redirectLogin");
let questionValidation = require('../middleware/validator');
let questionController = require('../controllers/question');
const express = require("express");

const router = express.Router();


//CREATE A QUESTION--------------------------ADMIN ROUTE
router.post("/createquestion/:id", questionValidation.questionValidationRules(), questionValidation.validateQuestion, questionController.createQuestion);

// GET CREATE QUESTION PAGE-----------ADMIN ROUTE
router.get("/createquestion/:id", redirectLogin, questionController.getCreateQuestionPage);

//GET QUESTION BY ID----ADMIN ROUTE
router.get("/questions/:id", redirectLogin, questionController.getQuestionById);

//GET EDIT QUESTION ROUTE----ADMIN ROUTE
router.get("/edit/:id", redirectLogin, questionController.editQuestionPage);

//EDIT QUESTION--------ADMIN ROUTE
router.post("/edit/:id", questionValidation.questionValidationRules(), questionValidation.validateQuestion, questionController.editQuestion);

//DELETE QUESTION-----ADMIN ROUTE
router.get("/delete/:id", redirectLogin, questionController.deleteQuestion);

//ALL QUESTION BY QUIZ ID PAGE------ADMIN ROUTE
router.get("/question/:id", redirectLogin, questionController.getAllQuestions);

//ALL QUESTION PAGE------ADMIN ROUTE
router.get("/questions/all", redirectLogin);

module.exports = router;
