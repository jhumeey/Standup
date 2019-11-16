
const mongoose = require("mongoose");

const Department = mongoose.model(
    "Department",
    new mongoose.Schema({
        department: {
            type: String
        },
    }, {
        timestamps: true
    }), "Departments"
);


exports.Department = Department;

