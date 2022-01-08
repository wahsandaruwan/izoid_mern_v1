const express = require('express')
const router = express.Router()
const { adminRegistration, adminLogin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin, getAdminsBySearch } = require("../controllers/adminController")
const { authUser, authRole } = require("../middleware/auth")

// Admin registration route
router.post("/register", authUser, authRole(["Owner"]), adminRegistration)

// Admin login route
router.post("/login", adminLogin)

// Get all admins route
router.get("/", authUser, authRole(["Owner"]), getAllAdmins)

// Get an admin by id route
router.get("/:id", authUser, authRole(["Owner"]), getAdminById)

// Update an admin route
router.put("/:id", authUser, authRole(["Owner"]), updateAdmin)

// Delete an admin route
router.delete("/:regCode/:id", authUser, authRole(["Owner"]), deleteAdmin)

// Get admins by search query
router.get("/search/:searchQuery", authUser, authRole(["Owner"]), getAdminsBySearch)

module.exports = router