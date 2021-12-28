const express = require('express')
const router = express.Router()
const { adminRegistration, adminLogin, getAllAdmins } = require("../controllers/adminController")

// Admin registration route
router.post("/register", adminRegistration)

// Admin login route
router.post("/login", adminLogin)

// All admins receive route
router.get("/", getAllAdmins)

module.exports = router