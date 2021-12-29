const express = require('express')
const router = express.Router()
const { adminRegistration, adminLogin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin, getAdminsBySearch } = require("../controllers/adminController")
const { authUser } = require("../middleware/auth")

// Admin registration route
router.post("/register", authUser, adminRegistration)

// Admin login route
router.post("/login", adminLogin)

// Get all admins route
router.get("/", getAllAdmins)

// Get an admin by id route
router.get("/:id", getAdminById)

// Update an admin route
router.put("/:id", updateAdmin)

// Delete an admin route
router.delete("/:id", deleteAdmin)

// Get admins by search query
router.get("/search/:searchQuery", getAdminsBySearch)

module.exports = router