const mongoose = require("mongoose");
const { validateEmail, validateName, validatePhone } = require("../helpers/dataValidation");

// Create student schema
const studentSchema = new mongoose.Schema(
    {
        regNum: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: [true, "Enter a first name!"],
            minlength: [2, "Minimum length of first name would be 2 characters!"],
            maxlength: [50, "Maximum length of first name would be 50 characters!"],
            validate: [validateName, "Enter first name only using letters!"]
        },
        lastName: {
            type: String,
            required: [true, "Enter a last name!"],
            minlength: [2, "Minimum length of last name would be 2 characters!"],
            maxlength: [50, "Maximum length of last name would be 50 characters!"],
            validate: [validateName, "Enter last name only using letters!"]
        },
        type: {
            type: String,
            required: [true, "Enter an user type!"]
        },
        gender: {
            type: String,
            required: [true, "Enter gender!"],
            enum: {
                values: ["Male", "Female"],
                message: "Enter either male or female as gender!",
            },
        },
        dateOfBirth: {
            type: String,
            required: [true, "Enter date of birth!"]
        },
        homeAddress: {
            type: String,
            required: [true, "Enter home address!"],
            minlength: [5, "Minimum length of home address would be 5 characters!"],
            maxlength: [150, "Maximum length of home address would be 150 characters!"]
        },
        schoolName: {
            type: String,
            required: [true, "Enter a school name!"],
            minlength: [2, "Minimum length of school name would be 3 characters!"],
            maxlength: [100, "Maximum length of school name would be 100 characters!"],
            validate: [validateName, "Enter school name only using letters!"]
        },
        parentsName: {
            type: String,
            required: [true, "Enter parent's name!"],
            minlength: [2, "Minimum length of parent's name would be 2 characters!"],
            maxlength: [50, "Maximum length of parent's name would be 50 characters!"],
            validate: [validateName, "Enter parent's name only using letters!"]
        },
        parentsPhone: {
            type: String,
            required: [true, "Enter parent's phone number!"],
            validate: [validatePhone, "Enter 10 digit phone number!"]
        },
        email: {
            type: String,
            required: [true, "Enter an email!"],
            unique: [true, "Enter an unique email!"],
            lowercase: [true, "Enter email in lower case!"],
            validate: [validateEmail, "Enter a proper email!"]
        },
        password: {
            type: String,
            required: [true, "Enter a password!"],
            minlength: [6, "Minimum length of password would be 6 characters!"]
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

module.exports = mongoose.model("Student", studentSchema)
