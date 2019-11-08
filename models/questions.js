const mongoose = require("mongoose");

const Question = mongoose.model(
	"Question",
	new mongoose.Schema({
		question: {
			type: String,
			required: true,
			minlength: 4,
			maxlength: 50
		},
		answers: {
			type: [String],
			required: true,
			minlength: 1,
			maxlength: 50
		},
		correctAnswer: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 50
		},
		activity_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Activity"
		}
	}), "Questions"
);

exports.Question = Question;

