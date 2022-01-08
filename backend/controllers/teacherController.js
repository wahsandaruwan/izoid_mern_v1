const Teacher = require("../models/teacherModel")
const Admin = require("../models/adminModel")
const Student = require("../models/studentModel")
const Class = require("../models/classModel")
const bcrypt = require("bcrypt")
const { randomReg, randomJWT } = require("../helpers/randomGen")
const { sendEmail } = require('../helpers/sendEmail')

// Teacher registration
exports.teacherRegistration = async (req, res) => {
    const { firstName, lastName, gender, phone, email, password } = req.body
    let newPass = "";

    // Generate random reg number
    const regNum = randomReg("Teacher")

    // Check if reg num or email already exist
    const teacher = await Teacher.find({ $or: [{ email }, { regNum }] })
    if (teacher.length > 0) {
        if (teacher[0].email === email) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
        else if (teacher[0].regNum === regNum) {
            return res.json({ errors: { message: "Something went wrong try again!" } })
        }
    }

    // Check email exist in other collections
    const emailAdmin = await Admin.findOne({ email })
    const emailStudent = await Student.findOne({ email })
    if (emailAdmin || emailStudent) {
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

    // Create a new teacher
    const newTeacher = new Teacher({
        regNum: regNum,
        firstName: firstName,
        lastName: lastName,
        type: "Teacher",
        gender: gender,
        phone: phone,
        email: email,
        password: newPass
    })

    try {
        await newTeacher.save()
        // Send email to new teacher
        sendEmail(email, regNum, `Your Izoid Teacher account has been successfully created!`, password)
        res.status(200).json({ created: true, success: { message: `Successfully created a new Teacher!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Teacher login
exports.teacherLogin = async (req, res) => {
    const { type, email, password } = req.body

    // Check if reg num already exists
    const teacher = await Teacher.findOne({ email })
    if (!teacher) {
        return res.json({ errors: { message: "Wrong email address!" } })
    }

    // Check if password matches
    const passOk = await bcrypt.compare(password, teacher.password)
    if (!passOk) {
        return res.json({ errors: { message: "Wrong password!" } })
    }

    // Confirm the type
    if (!type === "Teacher") {
        return res.json({ errors: { message: "Wrong user type!" } })
    }

    // Generate jwt
    const jwt = randomJWT(teacher)
    res.status(200).json({ auth: true, token: jwt, regNum: teacher.regNum, firstName: teacher.firstName, type: teacher.type })
}

// Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
        res.status(200).json(teachers)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a teacher by id
exports.getTeacherById = async (req, res) => {
    const { id } = req.params

    try {
        const teacher = await Teacher.findById(id)
        res.status(200).json(teacher)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update a teacher
exports.updateTeacher = async (req, res) => {
    const { id } = req.params
    const { email, password } = req.body
    let updatedPass = "";

    // Get existing admin password by Id
    const teacherById = await Teacher.findOne({ _id: id })
    if (teacherById) {
        if (!password) {
            req.body.password = teacherById.password
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
    const teacherByEmail = await Teacher.findOne({ email })
    if (teacherByEmail) {
        if (teacherByEmail.id !== id) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
    }

    // Check email exist in other collections
    const emailAdmin = await Admin.findOne({ email })
    const emailStudent = await Student.findOne({ email })
    if (emailAdmin || emailStudent) {
        return res.json({ errors: { message: "Email already exist!" } })
    }

    try {
        await Teacher.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        // Send email to teacher
        if (updatedPass) {
            sendEmail(email, teacherById.regNum, `Your Izoid Teacher account password has been updated!`, password)
        }
        res.status(200).json({ created: true, success: { message: "Teacher successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
    const { regNum, id } = req.params

    try {
        await Teacher.findByIdAndDelete(id)
        // Delete teacher from classes
        await Class.updateMany({ teacherReg: regNum }, { $set: { teacherReg: "Not Assigned" } }, { multi: true })

        res.status(200).json({ created: true, success: { message: "Teacher successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get teachers by search query
exports.getTeachersBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const teachers = await Teacher.find({ $or: [{ regNum: regexQuery }, { firstName: regexQuery }, { lastName: regexQuery }, { phone: regexQuery }, { email: regexQuery }, { createdAt: regexQuery }] })
        res.status(200).json(teachers)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get a teacher by reg num | Only for backend
exports.getTeacherByRegNum = async (req, res) => {
    const { regNum } = req.params

    try {
        const teacher = await Teacher.findOne({ regNum })
        if (teacher) {
            res.send(true)
        }
        else {
            res.send(false)
        }
    } catch (err) {
        res.send(err.message)
    }
}