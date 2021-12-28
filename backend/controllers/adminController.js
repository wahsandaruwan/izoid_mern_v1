const Admin = require("../models/adminModel")
const bcrypt = require("bcrypt")
const { randomReg } = require("../helpers/randomGen")

// Admin registration
exports.adminRegistration = async (req, res) => {
    const { adminFirstName, adminLastName, adminType, adminEmail, adminPass } = req.body;
    // Generate random reg number
    const adminRegNum = randomReg(adminType)

    // Password hashing
    const hashedPass = await bcrypt.hash(adminPass, 8)

    // Check if reg num or email already exist
    const admin = await Admin.find({ $or: [{ adminEmail }, { adminRegNum }] })
    if (admin.length > 0) {
        if (admin[0].adminEmail === adminEmail) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
        else if (admin[0].adminRegNum === adminRegNum) {
            return res.json({ errors: { message: "Something went wrong, try again!" } })
        }
    }

    // Set hashed password
    const newPass = adminPass.length >= 6 ? hashedPass : false

    // Create a new admin
    const newAdmin = new Admin({
        adminRegNum,
        adminFirstName,
        adminLastName,
        adminType,
        adminEmail,
        adminPass: newPass
    })

    try {
        await newAdmin.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new ${adminType}!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Admin login
exports.adminLogin = async (req, res) => {
    const { adminRegNum, adminPass } = req.body

    // Check if reg nuk already exists
    const admin = await Admin.findOne({ adminRegNum })
    if (!admin) {
        return res.json({ errors: { message: "Wrong registration number!" } })
    }

    // Check if password matches
    const passOk = await bcrypt.compare(adminPass, admin.adminPass)
    if (!passOk) {
        return res.json({ errors: { message: "Wrong password!" } })
    }

    res.status(200).json({ created: true, success: { message: `Successfully logged in!` } })
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
    const { adminId } = req.params

    try {
        const admin = await Admin.findById(adminId)
        res.status(200).json(admin)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}

// Update an admin
exports.updateAdmin = async (req, res) => {
    const { adminId } = req.params
    const { adminEmail, adminPass } = req.body
    let updatedPass = "";

    // Get existing admin password by Id
    const adminById = await Admin.findOne({ _id: adminId })
    console.log(adminById)
    if (adminById) {
        if (!adminPass) {
            req.body.adminPass = adminById.adminPass
        }
        else {
            updatedPass = adminPass

            // Password hashing
            const hashedPass = await bcrypt.hash(adminPass, 8)

            // Set hashed password
            req.body.adminPass = adminPass.length >= 6 ? hashedPass : false
        }
    }

    // Check if email already exists
    const adminByEmail = await Admin.findOne({ adminEmail })
    if (adminByEmail) {
        if (adminByEmail.id !== adminId) {
            return res.json({ errors: { message: "Email already exist!" } })
        }
    }

    try {
        await Admin.findOneAndUpdate({ _id: adminId }, req.body, { new: true, runValidators: true })
        res.status(200).json({ created: true, success: { message: "Admin successfully updated!" } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}

// Delete an admin
exports.deleteAdmin = async (req, res) => {
    const { adminId } = req.params

    try {
        await Admin.findByIdAndDelete(adminId)
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
        const admins = await Admin.find({ $or: [{ adminFirstName: regexQuery }, { adminLastName: regexQuery }, { adminEmail: regexQuery }, { adminType: regexQuery }] })
        res.status(200).json(admins)
    } catch (err) {
        res.json({ errors: { message: err.message } })
    }
}