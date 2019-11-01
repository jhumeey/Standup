
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
		checkin_Date: {
			type: Date
		}
	})
);


exports.Check_in = Check_in;

