const express = require("express");
let router = express.Router();
let UserController = require('../controllers/users');
let UserValidation = require('../middleware/validator');
const redirectLogin = require("../middleware/redirectLogin");


//GET ALL USERS -----ADMIN ROUTE
router.get("/all", redirectLogin, UserController.getAllUsers)

//CREATE USER PAGE----ADMIN ROUTE
router.get("/create", redirectLogin, UserController.createUserPage)

//CREATE USER ROUTE-------ADMIN ROUTE
router.post("/register", UserValidation.createUserValidationRules(), UserValidation.createValidate,
	UserController.registerUser)

//GET LOGIN PAGE------------USER ROUTE
router.get("/login", UserController.loginUserPage);

//LOGIN ROUTE ------------ USER ROUTE
router.post("/login", UserController.loginUser);

//GET USER PROFILE
router.get("/profile", redirectLogin, UserController.getUserProfile);

//UPDATE USER---------USER ROUTE
router.post("/update", UserValidation.UserProfileValidationRules(), UserValidation.userProfileValidate,
	UserController.updateUserByUser
);

//GET EDIT USER PAGE--------ADMIN ROUTE
router.get("/edit/:id", redirectLogin, UserController.getEditUserDetailsPage );

//EDIT USER ROUTE---------ADMIN ROUTE
router.post("/edit/:id", UserValidation.editUserValidationRules(), UserValidation.editValidate,
	UserController.editUserDetails
);

//DELETE A USER-------ADMIN ROUTE
router.get("/delete/:id", redirectLogin, UserController.deleteUser);

router.get("/logout", UserController.logoutUser);

module.exports = router;
