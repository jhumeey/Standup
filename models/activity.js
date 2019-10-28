const mongoose = require("mongoose");

const Question = mongoose.model(
	"Question",
	new mongoose.Schema({
		question: {
			type: String,
			required: true,
			minlength: 5,
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
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event"
		},
		quiz_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz"
		}
	})
);

exports.Question = Question;

