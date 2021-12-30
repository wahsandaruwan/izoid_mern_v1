const Student = require("../models/studentModel")
const bcrypt = require("bcrypt")
const { randomReg, randomJWT } = require("../helpers/randomGen")

// Admin registration
exports.studentRegistration = async (req, res) => {
    const { firstName, lastName, dateOfBirth, homeAddress, schoolName, parentsName, parentsPhone, email, password } = req.body
    let newPass = "";

    // Generate random reg number
    const regNum = randomReg("Student")

    // Check if reg num or email already exist
    const student = await Student.find({ $or: [{ email }, { regNum }] })
    if (student.length > 0) {
        if (student[0].email === email) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
        else if (student[0].regNum === regNum) {
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

    // Create a new admin
    const newStudent = new Student({
        regNum: regNum,
        firstName: firstName,
        lastName: lastName,
        type: "Student",
        dateOfBirth: dateOfBirth,
        homeAddress: homeAddress,
        schoolName: schoolName,
        parentsName: parentsName,
        parentsPhone: parentsPhone,
        email: email,
        password: newPass
    })

    try {
        await newStudent.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new Student!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get all admins
exports.getAllStudents = async (req, res) => {
    try {
        const student = await Student.find()
        res.status(200).json(student)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Get an admin by id
exports.getStudentById = async (req, res) => {
    const { id } = req.params

    try {
        const student = await Student.findById(id)
        res.status(200).json(student)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update an admin
exports.updateStudent = async (req, res) => {
    const { id } = req.params
    const { email, password } = req.body
    let updatedPass = "";

    // Get existing admin password by Id
    const studentById = await Student.findOne({ _id: id })
    if (studentById) {
        if (!password) {
            req.body.password = studentById.password
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
    const studentByEmail = await Student.findOne({ email })
    if (studentByEmail) {
        if (studentByEmail.id !== id) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
    }

    try {
        await Student.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Student successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete an admin
exports.deleteStudent = async (req, res) => {
    const { id } = req.params

    try {
        await Student.findByIdAndDelete(id)
        res.status(200).json({ created: true, success: { message: "Student successfully deleted!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Get admins by search query
exports.getStudentsBySearch = async (req, res) => {
    const { searchQuery } = req.params

    try {
        const regexQuery = new RegExp(searchQuery, 'i')
        const students = await Student.find({ $or: [{ regNum: regexQuery }, { firstName: regexQuery }, { lastName: regexQuery }, { email: regexQuery }, { dateOfBirth: regexQuery }, { parentsName: regexQuery }, { parentsPhone: regexQuery }] })
        res.status(200).json(students)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}