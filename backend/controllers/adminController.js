const Admin = require("../models/adminModel")
const Teacher = require("../models/teacherModel")
const Student = require("../models/studentModel")
const bcrypt = require("bcrypt")
const { randomReg, randomJWT } = require("../helpers/randomGen")
const { sendEmail } = require('../helpers/sendEmail')

// Admin registration
exports.adminRegistration = async (req, res) => {
    const { firstName, lastName, gender, type, email, password } = req.body
    let newPass = "";

    // Generate random reg number
    const regNum = randomReg(type)

    // Check reg num or email already exist
    const admin = await Admin.find({ $or: [{ email }, { regNum }] })
    if (admin.length > 0) {
        if (admin[0].email === email) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
        else if (admin[0].regNum === regNum) {
            return res.json({ errors: { message: "Something went wrong try again!" } })
        }
    }

    // Check email exist in other collections
    const emailTeacher = await Teacher.findOne({ email })
    const emailStudent = await Student.findOne({ email })
    if (emailTeacher || emailStudent) {
        return res.json({ errors: { message: "Email already exist!" } })
    }

    // Password hashing
    const hashedPass = await bcrypt.hash(password, 8)

    // Set hashed password
    if (password.length < 6 && password.length > 0) {
        newPass = false
    }
    else if (password.length === 0) {
        newPass = ""
    }
    else {
        newPass = hashedPass
    }

    // Create a new admin
    const newAdmin = new Admin({
        regNum: regNum,
        firstName: firstName,
        lastName: lastName,
        type: type,
        gender: gender,
        email: email,
        password: newPass
    })

    try {
        await newAdmin.save()
        // Send email to new admin
        sendEmail(email, regNum, `Your Izoid ${type} Admin account has been successfully created!`, password)
        res.status(200).json({ created: true, success: { message: `Successfully created a new ${type}!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Admin login
exports.adminLogin = async (req, res) => {
    const { type, email, password } = req.body

    // Check if reg num already exists
    const admin = await Admin.findOne({ email })
    if (!admin) {
        return res.json({ errors: { message: "Wrong email address!" } })
    }

    // Check if password matches
    const passOk = await bcrypt.compare(password, admin.password)
    if (!passOk) {
        return res.json({ errors: { message: "Wrong password!" } })
    }

    // Confirm the type
    if (!type === "admin") {
        return res.json({ errors: { message: "Wrong user type!" } })
    }

    // Generate jwt
    const jwt = randomJWT(admin)
    res.status(200).json({ auth: true, token: jwt, regNum: admin.regNum, firstName: admin.firstName, type: admin.type })
}

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find()
        res.status(200).json(admins)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get an admin by id
exports.getAdminById = async (req, res) => {
    const { id } = req.params

    try {
        const admin = await Admin.findById(id)
        res.status(200).json(admin)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update an admin
exports.updateAdmin = async (req, res) => {
    const { id } = req.params
    const { email, password } = req.body
    let updatedPass = ""

    // Get existing admin password by Id
    const adminById = await Admin.findOne({ _id: id })
    if (adminById) {
        if (!password) {
            req.body.password = adminById.password
        }
        else {
            updatedPass = password

            // Password hashing
            const hashedPass = await bcrypt.hash(password, 8)

            // Set hashed password
            req.body.password = password.length >= 6 ? hashedPass : false
        }
    }

    // Check email already exists
    const adminByEmail = await Admin.findOne({ email })
    if (adminByEmail) {
        if (adminByEmail.id !== id) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
    }

    // Check email exist in other collections
    const emailTeacher = await Teacher.findOne({ email })
    const emailStudent = await Student.findOne({ email })
    if (emailTeacher || emailStudent) {
        return res.json({ errors: { message: "Email already exist!" } })
    }

    try {
        await Admin.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        // Send email to student
        if (updatedPass) {
            sendEmail(email, adminById.regNum, `Your Izoid Admin account password has been updated!`, password)
        }
        res.status(200).json({ created: true, success: { message: "Admin successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete an admin
exports.deleteAdmin = async (req, res) => {
    const { id, regCode } = req.params

    // Check admin trying to delete his/her own account
    const admin = await Admin.findById(id)
    if (admin) {
        if (admin.regNum === regCode) {
            return res.json({ errors: { message: "You can't delete your admin account!" } })
        }
    }

    try {
        await Admin.findByIdAndDelete(id)
        res.status(200).json({ created: true, success: { message: "Admin successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get admins by search query
exports.getAdminsBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const admins = await Admin.find({ $or: [{ regNum: regexQuery }, { firstName: regexQuery }, { lastName: regexQuery }, { email: regexQuery }, { type: regexQuery }, { createdAt: regexQuery }] })
        res.status(200).json(admins)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}