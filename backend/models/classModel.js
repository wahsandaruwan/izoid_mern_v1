const mongoose = require("mongoose");

// Create class schema
const classSchema = new mongoose.Schema({
    grade: {
        type: String,
        required: [true, "Enter a grade!"]
    },
    subject: {
        type: String,
        required: [true, "Enter a subject!"]
    },
    group: {
        type: String,
        required: [true, "Enter a group!"]
    },
    teacherReg: {
        type: String,
        required: [true, "Enter a teacher registration code!"]
    },
    studentReg: {
        type: String,
        required: [true, "Enter a student registration code!"]
    }
})

module.exports = mongoose.model("Class", classSchema)
