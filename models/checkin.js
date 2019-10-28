
const mongoose = require("mongoose");

const Check_in = mongoose.model(
	"Check-in",
	new mongoose.Schema({
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		event_id: {
			type: mongoose.Types.ObjectId,
			ref: "Event"
		},
		datetime: {
			type: Date,
			default: Date.now
		}
	})
);


exports.Check_in = Check_in;

