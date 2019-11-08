let UsersScoresController = require('../controllers/userscores');
const redirectLogin = require("../middleware/redirectLogin");
const express = require("express");
const router = express.Router();

//GET USER SCORES---------USER ROUTE
router.get("/userscores", redirectLogin, UsersScoresController.getUsersScores);

module.exports = router;
