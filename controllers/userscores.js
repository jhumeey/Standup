const { Userscores } = require("../models/userscores");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

exports.getUsersScores = async (req, res) => {
	try {
		let user = req.session.user;
		let user_id = user._id;
		Userscores.aggregate(
			[
				{ "$match": { "user_id": ObjectId(user_id) } },
				{
					$lookup: {
						from: "Activities",
						localField: "activity_id",
						foreignField: "_id",
						as: "activities"
					},
				},
				{
					$project: {
						__v: 0, updatedAt: 0
					}
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: [
								{ $arrayElemAt: ["$activities", 0] }, "$$ROOT"
							]
						}
					}
				},
			],
			function (err, userscore) {
				if (err) {
					req.flash("error", { message: "Sorry cannot get Userscore" })
					res.redirect("/events")
				}
				res.render("userscores", { userscore });
			}
		)
	} catch (error) {
		console.log(error.message);
	}
}