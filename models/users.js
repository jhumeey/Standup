
const mongoose = require('mongoose');

const User = mongoose.model(
	"User",
	new mongoose.Schema({
		firstname: {
			type: String,
			index: true
		},
		lastname: {
			type: String,
			index: true
		},
		email: {
			type: String,
			unique: true
		},
		department: {
			type: String,
			index: true
		},
		password: {
			type: String
		},
		gender: {
			type: String
		},
		role: {
			type: String
		},
		event_id: {
			type: [String]
		}

	},
		{
			timestamps: true
		},

	), "Users"
);


exports.User = User;