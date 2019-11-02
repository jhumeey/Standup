
const mongoose = require("mongoose");

const Userscores = mongoose.model(
	"Userscores",
	new mongoose.Schema({
		score: {
			type: Number,
			required: true
		},
		activity_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Activity"
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		
	},
	{
		timestamps: true
	}),
	"UsersScores"
);



exports.Userscores = Userscores;

