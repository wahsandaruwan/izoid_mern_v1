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