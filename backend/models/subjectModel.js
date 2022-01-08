const mongoose = require("mongoose");

// Create subject schema
const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter a subject name!"],
            minlength: [2, "Minimum length of subject name would be 2 characters!"],
            maxlength: [50, "Maximum length of subject name would be 50 characters!"]
        },
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

module.exports = mongoose.model("Subject", subjectSchema)
