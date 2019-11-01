const mongoose = require("mongoose");

const Activity = mongoose.model(
	"Activity",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 500

		},
		activityType: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 500
		},
		description: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 500
		},
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event"
		}
	},
		{
			timestamps: true
		})
);

exports.Activity = Activity;

