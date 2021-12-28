const express = require('express')
const router = express.Router()
const { adminRegistration, adminLogin } = require("../controllers/adminController")

// Admin registration route
router.post("/register", adminRegistration)

// Admin login route
router.post("/login", adminLogin)

module.exports = router