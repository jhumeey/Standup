const { Check_in } = require("../models/checkin");
const { Quiz } = require("../models/quiz");
const { User } = require("../models/users");
const redirectLogin = require("../middleware/redirectLogin");
const mongoose = require("mongoose");
const debug = require("mongoose").set("debug", true);
const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();




module.exports = router;
