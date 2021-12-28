const Admin = require("../models/adminModel")
const bcrypt = require("bcrypt")
const { randomReg, randomJWT } = require("../helpers/randomGen")

// Admin registration
exports.adminRegistration = async (req, res) => {
    const { firstName, lastName, type, email, password } = req.body;
    // Generate random reg number
    const regNum = randomReg(type)

    // Check if reg num or email already exist
    const admin = await Admin.find({ $or: [{ email }, { regNum }] })
    if (admin.length > 0) {
        if (admin[0].email === email) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
        else if (admin[0].regNum === regNum) {
            return res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
        }
    }

    // Password hashing
    const hashedPass = await bcrypt.hash(password, 8)

    // Set hashed password
    const newPass = password.length >= 6 ? hashedPass : false

    // Create a new admin
    const newAdmin = new Admin({
        regNum: regNum,
        firstName: firstName,
        lastName: lastName,
        type: type,
        email: email,
        password: newPass
    })

    console.log(newAdmin)

    try {
        await newAdmin.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new ${type}!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Admin login
exports.adminLogin = async (req, res) => {
    const { regNum, password } = req.body

    // Check if reg nuk already exists
    const admin = await Admin.findOne({ regNum })
    if (!admin) {
        return res.json({ errors: { message: "Wrong registration number!" } })
    }

    // Check if password matches
    const passOk = await bcrypt.compare(password, admin.password)
    if (!passOk) {
        return res.json({ errors: { message: "Wrong password!" } })
    }

    // Generate jwt
    const jwt = randomJWT(admin)
    res.status(200).json({ auth: true, success: jwt, regNum: admin.regNum, type: admin.type })
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
exports.getAdminById = async function (req, res) {
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
    let updatedPass = "";

    // Get existing admin password by Id
    const adminById = await Admin.findOne({ _id: id })
    console.log(adminById)
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

    // Check if email already exists
    const adminByEmail = await Admin.findOne({ email })
    if (adminByEmail) {
        if (adminByEmail.id !== id) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
    }

    try {
        await Admin.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Admin successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete an admin
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params

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
        const admins = await Admin.find({ $or: [{ firstName: regexQuery }, { lastName: regexQuery }, { email: regexQuery }, { type: regexQuery }] })
        res.status(200).json(admins)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}