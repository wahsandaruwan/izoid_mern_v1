const mongoose = require("mongoose");
const { validateEmail, validateName } = require("../helpers/regexFunctions");

// Create user schema
const adminSchema = new mongoose.Schema({
    adminRegNum: {
        type: String,
        required: true
    },
    adminFirstName: {
        type: String,
        required: [true, "Enter a first name!"],
        minlength: [2, "Minimum length of first name would be 2 characters!"],
        maxlength: [50, "Maximum length of first name would be 50 characters!"],
        validate: [validateName, "Enter first name only using letters!"],
    },
    adminLastName: {
        type: String,
        required: [true, "Enter a last name!"],
        minlength: [2, "Minimum length of last name would be 2 characters!"],
        maxlength: [50, "Maximum length of last name would be 50 characters!"],
        validate: [validateName, "Enter last name only using letters!"],
    },
    adminType: {
        type: String,
        required: [true, "Enter an user type!"],
        enum: {
            values: ["Owner", "Manager"],
            message: "Enter either owner or manager as a user type!",
        },
    },
    adminEmail: {
        type: String,
        required: [true, "Enter an email!"],
        unique: [true, "Enter an unique email!"],
        lowercase: [true, "Enter email in lower case!"],
        validate: [validateEmail, "Enter a proper email!"],
    },
    adminPass: {
        type: String,
        required: [true, "Enter a password!"],
        minlength: [6, "Minimum length of password would be 6 characters!"],
    },
})

module.exports = mongoose.model("Admin", adminSchema)
