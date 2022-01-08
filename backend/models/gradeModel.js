const mongoose = require("mongoose");

// Create grade schema
const gradeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter a grade name!"],
            minlength: [2, "Minimum length of grade name would be 2 characters!"],
            maxlength: [50, "Maximum length of grade name would be 50 characters!"]
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

module.exports = mongoose.model("Grade", gradeSchema)
