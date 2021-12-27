const Admin = require("../models/adminModel")
const { randomReg } = require("../helpers/randomGen")

// Admin registration
exports.adminRegistration = async (req, res) => {
    const { adminFirstName, adminLastName, adminType, adminEmail, adminPass } = req.body;
    // Generate random reg number
    const adminRegNum = randomReg(adminType)

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