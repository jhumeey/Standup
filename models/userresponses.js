
const mongoose = require("mongoose");

const Userresponses = mongoose.model(
	"Userresponses",
	new mongoose.Schema({
		question_id: {

		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		quiz_id: {
			type: [String],
			ref: "Quiz_id"
		},
		option: {
			type: [String]
		},
		answer: {
			type: [String]
		}
	}),
	"UserResponses"
);


exports.Userresponses = Userresponses;

