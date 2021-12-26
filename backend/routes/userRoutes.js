const express = require('express')
const router = express.Router()

// User registration route
router.post("/register", userRegistration)

module.exports = router