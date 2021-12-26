const Admin = require("../models/adminModel")
const { randomReg } = require("../helpers/randomGen")

// Admin registration
exports.adminRegistration = async (req, res) => {
    const { adminFirstName, adminLastName, adminType, adminEmail, adminPass } = req.body;
    // Generate random reg number
    const adminRegNum = randomReg(adminType)

    // Create a new admin
    const newAdmin = new Admin({
        adminRegNum,
        adminFirstName,
        adminLastName,
        adminType,
        adminEmail,
        adminPass
    })

    try {
        await newAdmin.save()
        res.status(200).json({ created: true, success: { message: `Successfully created a new ${adminType}!` } })
    } catch (err) {
        res.json({ errors: { message: Object.entries(err.errors)[0][1].message } })
    }
}