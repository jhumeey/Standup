const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	},
	description: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 1024
	},
	status: {
		type: String
	},
	activity: {
		type: [String]
	},
	eventDate: {
		type: Date,
		default: Date.now
	}
});

const Event = mongoose.model("Event", eventSchema);


exports.Event = Event;
