const Teacher = require("../models/teacherModel")
const bcrypt = require("bcrypt")
const { randomReg } = require("../helpers/randomGen")

// Teacher registration
exports.teacherRegistration = async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body
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
        phone: phone,
        email: email,
        password: newPass
    })

    try {
        await newTeacher.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Teacher!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
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

    // Check if email already exists
    const teacherByEmail = await Teacher.findOne({ email })
    if (teacherByEmail) {
        if (teacherByEmail.id !== id) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
    }

    try {
        await Teacher.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Teacher successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
    const { id } = req.params

    try {
        await Teacher.findByIdAndDelete(id)
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
        const teachers = await Teacher.find({ $or: [{ regNum: regexQuery }, { firstName: regexQuery }, { lastName: regexQuery }, { phone: regexQuery }, { email: regexQuery }] })
        res.status(200).json(teachers)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}