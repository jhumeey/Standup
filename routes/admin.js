const express = require("express");
const { Userscores, validate } = require("../models/userscores");
const redirectLogin = require("../middleware/redirectLogin");

let router = express.Router();

//ADMIN DASHBOARD ROUTE----------ADMIN ROUTE
router.get("/dashboard", redirectLogin, function (req, res) {
	Userscores.aggregate(
		[
			{
				$group:
				{
					_id: "$user_id",
					avgScore: { $avg: "$score" }
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "user"
				}
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: [
							{ $arrayElemAt: ["$user", 0] }, "$$ROOT"
						]
					}
				}
			},
			{
				$project: {
					user: 0, password: 0, __v: 0
				}
			}
		], function (err, result) {
			// res.send(result);
			res.render("dashboard", {result});
			// for (i = 0; i < result.length; i++) {
			//  var scoreArray = [];
			//  scoreArray.push(result[i].avgScore);
			// 	console.log(scoreArray);
			// 	var highestScore = 0;
			// 	for(j=0; scoreArray.length > j; j++){
			// 		console.log(scoreArray[j]);
			// 		if(scoreArray[j] > highestScore){
			// 			highestScore = scoreArray[j];
			// 			console.log(highestScore);
			// 		}
			// 	}
			// }
			
		}
		
	)

	
});

module.exports = router;
