const mongoose = require("mongoose");

// Create meeting schema
const meetingSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: [true, "Enter a title!"],
            minlength: [2, "Minimum length of title would be 2 characters!"],
            maxlength: [50, "Maximum length of title would be 50 characters!"]
        },
        description: {
            type: String,
            required: [true, "Enter a description!"],
            minlength: [8, "Minimum length of description would be 8 characters!"],
            maxlength: [150, "Maximum length of description would be 150 characters!"]
        },
        date: {
            type: String,
            required: [true, "Enter meeting date!"]
        },
        time: {
            type: String,
            required: [true, "Enter meeting time!"]
        },
        link: {
            type: String,
            required: [true, "Enter meeting link!"],
            minlength: [2, "Minimum length of download link would be 5 characters!"],
            maxlength: [500, "Maximum length of download link would be 500 characters!"]
        },
        visibility: {
            type: String,
            required: [true, "Enter visibility!"],
            enum: {
                values: ["Public", "Private"],
                message: "Enter either public or private as visibility!",
            },
        },
        teacherReg: {
            type: String,
            required: true
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

module.exports = mongoose.model("Meeting", meetingSchema)
