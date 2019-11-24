const { User } = require("../models/users");
const { Department } = require("../models/departments");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

exports.getAllUsers = async (req, res) => {
	try {
		let users = await User.find();
		if (users) {
			res.render("allusers", { users, deleteHandler: "deleteUser();" });
		}
		else {
			req.flash("error", { message: "Sorry Cannot find users" });
		}
	} catch (error) {
		console.log(error)
		req.flash("error", { message: "Cannot get users" });
		res.redirect("/users/all");
	}


}

exports.createUserPage = async (req, res) => {
	try {
		let departments = await Department.find();
		res.render("create user", { departments });
	} catch (error) {
		req.flash("error", { message: "Sorry Cannot get the page you are looking for" });
		console.log(error)
		res.redirect("/users/all");
	}

}

exports.registerUser = async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (user) {
			req.flash("error", { message: "User already registered" });
			res.redirect("/users/create");
		}
		user = new User(
			_.pick(req.body, [
				"firstname",
				"lastname",
				"email",
				"password",
				"gender",
				"department",
				"role"
			])
		);
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		await user.save();
		req.flash("success", { message: `${user.firstname}'s account created successfully!` });
		res.redirect("/users/all");
	} catch (error) {
		req.flash("error", { message: "error saving user" });
		console.log(`Error saving user: ${error.message}`);
	}
}

exports.loginUserPage = (req, res) => {
	try {
		res.render("login");
	} catch (error) {
		console.log(error)
		req.flash("error", { message: "Sorry, Cannot get the page you are looking for" });
		res.redirect("/users/login");
	}

}
exports.loginUser = async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (!user) {
			req.flash("error", { message: "Invalid email or password" });
			res.redirect("/users/login");
		} else {
			const validPassword = await bcrypt.compare(req.body.password, user.password);
			if (!validPassword) {
				req.flash("error", { message: "Invalid email or password." });
				res.redirect("/users/login");
			} else if (user.role.toLowerCase() == "admin") {
				req.session.user = user;
				res.redirect("/admin/dashboard");
			} else {
				req.session.user = user;
				res.redirect("/events");
			}
		}

	} catch (error) {
		console.log(error);
		req.flash("error", { message: "Invalid credentials, kindly, contact the administrator." });
		res.redirect("/users/login");
	}

}
exports.getUserProfile = async (req, res) => {
	try {
		let user = req.session.user;
		userId = user._id;
		let user_details = await User.findById(userId);
		res.render("profile", { user_details });
	} catch (error) {
		console.log(error);
		req.flash("error", { message: "Sorry, Cannot find the page you are looking for." });
		res.redirect("/users/profile");
	}

}
exports.updateUserByUser = async (req, res) => {
	try {
		const body = {
			id: req.body.id,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			department: req.body.department,

		};
		await User.findByIdAndUpdate(req.body.id, body, function (err) {
			if (err) {
				req.flash("error", { message: "Could not update user." });
			}
			req.flash("success", { message: "User updated succesfully." });
			res.redirect("/users/profile");
		});
	} catch (error) {
		req.flash("error", { message: "Error updating user" });
		console.log(error.message);
	}

}
exports.getEditUserDetailsPage = async (req, res) => {
	try {
		let departments = await Department.find();
		const user = await User.findByIdAndUpdate(req.params.id);
		res.render("edit", { user, departments });
	} catch (error) {
		req.flash("error", { message: "Sorry, cannot find the page you are looking for" });
		res.redirect(302, "/users/all");
		console.log(error);
	}

}
exports.editUserDetails = async (req, res) => {
	try {
		const body = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			gender: req.body.gender,
			address: req.body.address,
			role: req.body.role,
			department: req.body.department,
		};
		await User.findByIdAndUpdate(req.params.id, body, function (err) {
			if (err) {
				req.flash("error", { message: "User cannot be updated." });
				res.redirect(302, "/users/edit/" + req.body.id);
				console.log(err);
			}
			req.flash("success", { message: "User updated succesfully." });
			res.redirect(302, "/users/all");
		});
	} catch (error) {
		console.log(error)
		req.flash("error", { message: "User cannot be updated." });
		res.redirect(302, "/users/edit/" + req.body.id);
	}

}
exports.deleteUser = async (req, res) => {
	try {
		await User.findByIdAndRemove(req.params.id);
		req.flash("success", { message: "User deleted succesfully." });
		res.redirect("/users/all");
	} catch (error) {
		console.log(error)
		req.flash("error", { message: "Sorry, User cannot be deleted, Please contact the administrator." });
		res.redirect("/users/all");
	}

}
exports.logoutUser = async (req, res) => {
	try {
		if (req.session) {
			req.session = null
			res.redirect('/users/login')
		}
	} catch (error) {
		console.log(error);
		req.flash("error", { message: "Your session has expired" });
		res.redirect("/");
	}
}