const mongoose = require("mongoose");

// Create group schema
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter a group name!"],
        minlength: [2, "Minimum length of group name would be 2 characters!"],
        maxlength: [50, "Maximum length of group name would be 50 characters!"]
    }
})

module.exports = mongoose.model("Group", groupSchema)
