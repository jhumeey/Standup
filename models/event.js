const mongoose = require("mongoose");

const Event  = mongoose.model( "Event",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
			minlength: 4,
			maxlength: 50
		},
		description: {
			type: String,
			required: true,
			minlength: 4,
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
		},
		createdBy:{
			type: String
		}
	},
		{
			timestamps: true
		},
),
	"Events");


exports.Event = Event;
