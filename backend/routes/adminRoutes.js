const express = require('express')
const router = express.Router()
const { adminRegistration, adminLogin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin, getAdminsBySearch } = require("../controllers/adminController")
const { authUser } = require("../middleware/auth")

// Admin registration route
router.post("/register", authUser, adminRegistration)

// Admin login route
router.post("/login", adminLogin)

// Get all admins route
router.get("/", authUser, getAllAdmins)

// Get an admin by id route
router.get("/:id", authUser, getAdminById)

// Update an admin route
router.put("/:id", authUser, updateAdmin)

// Delete an admin route
router.delete("/:id", authUser, deleteAdmin)

// Get admins by search query
router.get("/search/:searchQuery", authUser, getAdminsBySearch)

module.exports = router