
const mongoose = require("mongoose");

const Userscores = mongoose.model(
	"Userscores",
	new mongoose.Schema({
		score: {
			type: Number,
			required: true
		},
		quiz_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz"
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		quiz_title: {
			type: String
		},
		dateTaken: {
			type: Date
		}
	}),
	"UsersScores"
);



exports.Userscores = Userscores;

