const express = require('express')
const router = express.Router()
const { adminRegistration, adminLogin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin, getAdminsBySearch } = require("../controllers/adminController")

// Admin registration route
router.post("/register", adminRegistration)

// Admin login route
router.post("/login", adminLogin)

// Get all admins route
router.get("/", getAllAdmins)

// Get an admin by id route
router.get("/:adminId", getAdminById)

// Update an admin route
router.put("/:adminId", updateAdmin)

// Delete an admin route
router.delete("/:adminId", deleteAdmin)

// Get admins by search query
router.get("/search/:searchQuery", getAdminsBySearch)

module.exports = router