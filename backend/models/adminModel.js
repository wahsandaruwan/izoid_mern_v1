const mongoose = require("mongoose");
const { validateEmail, validateName } = require("../helpers/dataValidation");

// Create admin schema
const adminSchema = new mongoose.Schema(
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
            validate: [validateName, "Enter first name only using letters!"],
        },
        lastName: {
            type: String,
            required: [true, "Enter a last name!"],
            minlength: [2, "Minimum length of last name would be 2 characters!"],
            maxlength: [50, "Maximum length of last name would be 50 characters!"],
            validate: [validateName, "Enter last name only using letters!"],
        },
        type: {
            type: String,
            required: [true, "Enter an user type!"],
            enum: {
                values: ["Owner", "Manager"],
                message: "Enter either owner or manager as a user type!",
            },
        },
        gender: {
            type: String,
            required: [true, "Enter gender!"],
            enum: {
                values: ["Male", "Female"],
                message: "Enter either male or female as gender!",
            },
        },
        email: {
            type: String,
            required: [true, "Enter an email!"],
            unique: [true, "Enter an unique email!"],
            lowercase: [true, "Enter email in lower case!"],
            validate: [validateEmail, "Enter a proper email!"],
        },
        password: {
            type: String,
            required: [true, "Enter a password!"],
            minlength: [6, "Minimum length of password would be 6 characters!"],
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

module.exports = mongoose.model("Admin", adminSchema)
