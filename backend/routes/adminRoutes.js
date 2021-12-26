const express = require('express')
const router = express.Router()
const { adminRegistration } = require("../controllers/adminController")

// User registration route
router.post("/register", adminRegistration)

module.exports = router