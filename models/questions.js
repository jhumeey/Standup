const mongoose = require("mongoose");

const Question = mongoose.model(
	"Question",
	new mongoose.Schema({
		question_text: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 50
		},
		quiz_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz"
		},
		question_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question"
		},
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event"
		}
	}),
	"Questions"
);

exports.Question = Question;
