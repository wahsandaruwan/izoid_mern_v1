const Teacher = require("./teacherModel")
const mongoose = require("mongoose");

// Create class schema
const classSchema = new mongoose.Schema(
    {
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
            required: [true, "Enter teacher's registration code!"]
        },
        students: [String],
        assignments: [mongoose.Schema.Types.ObjectId],
        meetings: [mongoose.Schema.Types.ObjectId],
        createdAt: {
            type: String,
            immutable: true,
            default: () => new Date().toISOString()
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Class", classSchema)
