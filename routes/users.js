const express = require("express");
let router = express.Router();
let UserController = require('../controllers/users');
let UserValidation = require('../middleware/validator');
const redirectLogin = require("../middleware/redirectLogin");

router.get("/all", redirectLogin, UserController.getAllUsers)

router.get("/create", redirectLogin, UserController.createUserPage)

router.post("/register", UserValidation.createUserValidationRules(), UserValidation.createValidate, UserController.registerUser)

router.get("/login", UserController.loginUserPage);

router.post("/login", UserController.loginUser);

router.get("/profile", redirectLogin, UserController.getUserProfile);

router.post("/update", UserValidation.UserProfileValidationRules(), UserValidation.userProfileValidate,UserController.updateUserByUser);

router.get("/edit/:id", redirectLogin, UserController.getEditUserDetailsPage );

router.post("/edit/:id", UserValidation.editUserValidationRules(), UserValidation.editValidate, UserController.editUserDetails);

router.get("/delete/:id", redirectLogin, UserController.deleteUser);

router.get("/logout", UserController.logoutUser);

module.exports = router;
