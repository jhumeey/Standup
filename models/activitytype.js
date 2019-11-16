
const mongoose = require("mongoose");

const Activity_type = mongoose.model(
    "Activity_type",
    new mongoose.Schema({
        activity: {
            type: String
        },
    }, {
        timestamps: true
    }), "ActivityTypes"
);


exports.Activity_type = Activity_type;

