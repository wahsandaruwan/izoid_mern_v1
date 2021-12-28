const express = require('express')
const router = express.Router()
const { adminRegistration, adminLogin, getAllAdmins, getAdminById } = require("../controllers/adminController")

// Admin registration route
router.post("/register", adminRegistration)

// Admin login route
router.post("/login", adminLogin)

// Get all admins route
router.get("/", getAllAdmins)

// Get an admin by id route
router.get("/:adminId", getAdminById)

module.exports = router