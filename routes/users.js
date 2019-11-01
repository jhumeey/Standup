const express = require("express");
let router = express.Router();
let UserController = require('../controllers/users');
const { userValidationRules, validate } = require('../middleware/validator');
const redirectLogin = require("../middleware/redirectLogin");


//GET ALL USERS -----ADMIN ROUTE
router.get("/all", redirectLogin, UserController.getAllUsers)

//CREATE USER PAGE----ADMIN ROUTE
router.get("/create", redirectLogin, UserController.createUserPage)

//CREATE USER ROUTE-------ADMIN ROUTE
router.post("/register", userValidationRules(), validate,
	UserController.registerUser)

//GET LOGIN PAGE------------USER ROUTE
router.get("/login", UserController.loginUserPage);

//LOGIN ROUTE ------------ USER ROUTE
router.post("/login", UserController.loginUser);

//GET USER PROFILE
router.get("/profile", redirectLogin, UserController.getUserProfile);

//UPDATE USER---------USER ROUTE
router.post("/update",
//  [

// 	check('firstname').isString().isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters'),
// 	check('lastname').isString().isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters'),
// 	check('email').isEmail().withMessage("Email must be valid"),
// 	check('department').isString().withMessage("A Department must be choosen"),

// ],
	UserController.updateUserByUser
);

//GET EDIT USER PAGE--------ADMIN ROUTE
router.get("/edit/:id", redirectLogin, UserController.getEditUserDetailsPage);

//EDIT USER ROUTE---------ADMIN ROUTE
router.post("/edit",
//  [
// 	check('firstname').isString().isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters').matches(/^[A-Z][a-z0-9_-]{4,19}$/),
// 	check('lastname').isString().isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters').matches(/^[A-Z][a-z0-9_-]{4,19}$/),
// 	check('email').isEmail().withMessage("Email must be valid"),
// 	check('gender').isString().withMessage("A Gender Must be choosen"),
// 	check('department').isString().withMessage("A Department must be choosen"),
// 	check('role').isString().withMessage("An Option must be selected"),
// 	check('password').isLength({ min: 5 }).withMessage("Password must not be less than 5 characters"),
// ],
	UserController.editUserDetails
);

//DELETE A USER-------ADMIN ROUTE
router.get("/delete/:id", redirectLogin, UserController.deleteUser);

router.get("/logout", UserController.logoutUser);

module.exports = router;
