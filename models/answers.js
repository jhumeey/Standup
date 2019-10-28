
const mongoose = require("mongoose");

const Answer = mongoose.model(
	"Answer",
	new mongoose.Schema({
		choices: {
			type: [String],
			required: true,
			minlength: 5,
			maxlength: 50
		},
		question_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question"
		},
		event_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event"
		},
		isCorrectAnswer: {
			type: String,
			required: true
		}
	})
);

function validateAnswer(answer) {
	const schema = {
		choices: Joi.array()
			.min(3)
			.max(3)
			.required(),
		question_id: Joi.objectId()
			.min(15)
			.max(30)
			.required(),
		event_id: Joi.objectId()
			.min(15)
			.max(30)
			.required(),
		isCorrectAnswer: Joi.string()
			.min(3)
			.max(30)
			.required()
	};

	return Joi.validate(answer, schema);
}
exports.Answer = Answer;
exports.validate = validateAnswer;
