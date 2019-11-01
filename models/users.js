
const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
	firstname: {
		type: String,
		index: true
	},
	lastname: {
		type: String,
		index: true
	},
	email: {
		type: String
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
	},
	activity_id: {
		type: [String]
	}

},
	{
		timestamps: true
	});

const User = mongoose.model('User', UserSchema);
exports.User = User;